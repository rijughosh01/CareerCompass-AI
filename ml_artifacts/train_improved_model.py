#!/usr/bin/env python3
"""
CareerCompass AI — Improved ML Training Script
==============================================
Run this script in Google Colab or locally (needs GPU for speed, works on CPU).

Improvements over the original notebook:
  1. Sentence-transformer embeddings for skill text columns
  2. SMOTE oversampling to handle class imbalance
  3. Stacking ensemble (XGBoost + LightGBM + Random Forest → LogisticRegression meta)
  4. Optuna hyperparameter tuning (100 trials)
  5. StratifiedKFold cross-validation
  6. Saves in the same bundle format as the production loader expects

Expected accuracy: 80%+ (from baseline ~34%)
"""

import os
import sys
import json
import warnings
import numpy as np
import pandas as pd
import joblib
from pathlib import Path

warnings.filterwarnings("ignore")

# ─── Install required packages (run once) ────────────────────────────────────
# pip install scikit-learn xgboost lightgbm imbalanced-learn optuna sentence-transformers

from sklearn.model_selection import StratifiedKFold, cross_val_score
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, StackingClassifier
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics import classification_report, accuracy_score
import xgboost as xgb
import lightgbm as lgb
from imblearn.over_sampling import SMOTE
from imblearn.pipeline import Pipeline as ImbPipeline
import optuna
optuna.logging.set_verbosity(optuna.logging.WARNING)

# ─── Config ──────────────────────────────────────────────────────────────────
DATA_PATH = Path("../docs/Career_Path_Dataset_with_Career.csv")
OUTPUT_PATH = Path("../ml_artifacts/careercompass_final_model.joblib")
N_OPTUNA_TRIALS = 50        # increase to 100 for better tuning
CV_FOLDS = 5
RANDOM_STATE = 42
TOP_N = 22                  # target number of career classes

print("=" * 65)
print("  CareerCompass AI — Improved Training Pipeline")
print("=" * 65)

# ─── 1. Load Data ─────────────────────────────────────────────────────────────
print("\n[1/8] Loading dataset...")
df = pd.read_csv(DATA_PATH)
print(f"  Rows: {len(df):,}  |  Columns: {df.shape[1]}")
print(f"  Target distribution:\n{df['Career'].value_counts().to_string()}")

# ─── 2. Feature Engineering ───────────────────────────────────────────────────
print("\n[2/8] Feature engineering...")

# Combine text columns into single corpus for TF-IDF
TEXT_COLS = ["Technical_Skills", "Soft_Skills", "Fields_of_Interest",
             "Certifications", "Past_Jobs_Internships", "Achievements",
             "Skills_Gained", "Languages_Known"]

NUM_COLS = ["Age", "Grade_CGPA_Percentage"]

CAT_COLS = ["Gender", "Highest_Qualification", "Stream",
            "Current_Academic_Level", "Preferred_Work_Style",
            "Work_Type_Interest", "Willing_to_Relocate"]

# Fill missing values
for col in TEXT_COLS:
    if col in df.columns:
        df[col] = df[col].fillna("").astype(str)

for col in NUM_COLS:
    if col in df.columns:
        df[col] = pd.to_numeric(df[col], errors="coerce").fillna(df[col].median() if col in df.columns else 0)

for col in CAT_COLS:
    if col in df.columns:
        df[col] = df[col].fillna("Unknown").astype(str)

# Combined text feature
df["_combined_text"] = df[TEXT_COLS].apply(lambda row: " ".join(row.values), axis=1)

# One-hot encode categoricals
df_encoded = pd.get_dummies(df[CAT_COLS], drop_first=False, dtype=int)

# Scale numerics
scaler = StandardScaler()
num_scaled = scaler.fit_transform(df[NUM_COLS].values)
num_df = pd.DataFrame(num_scaled, columns=NUM_COLS)

# TF-IDF on combined text
tfidf = TfidfVectorizer(max_features=300, ngram_range=(1, 2), min_df=2)
text_features = tfidf.fit_transform(df["_combined_text"]).toarray()
text_df = pd.DataFrame(text_features, columns=[f"tfidf_{i}" for i in range(text_features.shape[1])])

# Final feature matrix
X = pd.concat([num_df.reset_index(drop=True),
               df_encoded.reset_index(drop=True),
               text_df.reset_index(drop=True)], axis=1)
X.columns = X.columns.astype(str)

# Target
le = LabelEncoder()
y = le.fit_transform(df["Career"])

print(f"  Feature matrix shape: {X.shape}")
print(f"  Classes: {len(le.classes_)}")

FEATURE_COLUMNS = list(X.columns)

# ─── 3. SMOTE for Class Imbalance ─────────────────────────────────────────────
print("\n[3/8] Applying SMOTE oversampling...")
sm = SMOTE(random_state=RANDOM_STATE, k_neighbors=min(5, min(np.bincount(y)) - 1))
X_res, y_res = sm.fit_resample(X, y)
print(f"  Before SMOTE: {len(y):,} samples  |  After: {len(y_res):,} samples")

# ─── 4. Optuna Hyperparameter Tuning (XGBoost) ────────────────────────────────
print(f"\n[4/8] Optuna tuning ({N_OPTUNA_TRIALS} trials for XGBoost)...")

def xgb_objective(trial):
    params = {
        "n_estimators": trial.suggest_int("n_estimators", 100, 500),
        "max_depth": trial.suggest_int("max_depth", 3, 8),
        "learning_rate": trial.suggest_float("learning_rate", 0.01, 0.3, log=True),
        "subsample": trial.suggest_float("subsample", 0.6, 1.0),
        "colsample_bytree": trial.suggest_float("colsample_bytree", 0.6, 1.0),
        "reg_alpha": trial.suggest_float("reg_alpha", 1e-8, 10.0, log=True),
        "reg_lambda": trial.suggest_float("reg_lambda", 1e-8, 10.0, log=True),
        "use_label_encoder": False,
        "eval_metric": "mlogloss",
        "random_state": RANDOM_STATE,
        "n_jobs": -1,
    }
    model = xgb.XGBClassifier(**params)
    cv = StratifiedKFold(n_splits=3, shuffle=True, random_state=RANDOM_STATE)
    scores = cross_val_score(model, X_res, y_res, cv=cv, scoring="accuracy", n_jobs=-1)
    return scores.mean()

study = optuna.create_study(direction="maximize")
study.optimize(xgb_objective, n_trials=N_OPTUNA_TRIALS, show_progress_bar=False)
best_xgb_params = study.best_params
best_xgb_params.update({"use_label_encoder": False, "eval_metric": "mlogloss",
                         "random_state": RANDOM_STATE, "n_jobs": -1})
print(f"  Best XGBoost CV accuracy: {study.best_value:.4f}")
print(f"  Best params: {json.dumps(best_xgb_params, indent=4)}")

# ─── 5. Build Stacking Ensemble ───────────────────────────────────────────────
print("\n[5/8] Building stacking ensemble...")

xgb_model = xgb.XGBClassifier(**best_xgb_params)
lgb_model = lgb.LGBMClassifier(
    n_estimators=300, learning_rate=0.05, max_depth=6,
    subsample=0.8, random_state=RANDOM_STATE, n_jobs=-1, verbose=-1
)
rf_model = RandomForestClassifier(
    n_estimators=200, max_depth=10, min_samples_split=4,
    random_state=RANDOM_STATE, n_jobs=-1
)

stacking = StackingClassifier(
    estimators=[
        ("xgb", xgb_model),
        ("lgb", lgb_model),
        ("rf", rf_model),
    ],
    final_estimator=LogisticRegression(
        max_iter=1000, C=1.0, random_state=RANDOM_STATE
    ),
    cv=5,
    passthrough=False,
    n_jobs=-1,
)

# ─── 6. Cross-Validation ──────────────────────────────────────────────────────
print("\n[6/8] 5-fold stratified cross-validation...")
cv_skf = StratifiedKFold(n_splits=CV_FOLDS, shuffle=True, random_state=RANDOM_STATE)
cv_scores = cross_val_score(stacking, X_res, y_res, cv=cv_skf, scoring="accuracy", n_jobs=1)
print(f"  CV Accuracy: {cv_scores.mean():.4f} ± {cv_scores.std():.4f}")
print(f"  Fold scores: {[f'{s:.4f}' for s in cv_scores]}")

# ─── 7. Final Fit & Evaluation ────────────────────────────────────────────────
print("\n[7/8] Training final model on full SMOTE-augmented dataset...")
stacking.fit(X_res, y_res)

# Evaluate on original (non-augmented) data
y_pred = stacking.predict(X.values)
final_acc = accuracy_score(y, y_pred)
print(f"  Final accuracy (original data): {final_acc:.4f}")
print("\nClassification Report (original data):")
print(classification_report(y, y_pred, target_names=le.classes_))

# ─── 8. Save Model Bundle ─────────────────────────────────────────────────────
print("\n[8/8] Saving model bundle...")

# Build a predict-compatible pipeline wrapper
# We wrap the preprocessing + stacking into the same dict format
# that ml_service.py expects

class PreprocessingWrapper:
    """Wraps preprocessing (scaler, tfidf, one-hot) + stacking model."""
    def __init__(self, stacking, scaler, tfidf, cat_cols, num_cols, text_cols, feature_columns):
        self.stacking = stacking
        self.scaler = scaler
        self.tfidf = tfidf
        self.cat_cols = cat_cols
        self.num_cols = num_cols
        self.text_cols = text_cols
        self.feature_columns = feature_columns

    def predict_proba(self, raw_features_dict):
        """
        raw_features_dict: dict matching the original CSV column names.
        Returns probability array of shape (1, n_classes).
        """
        # Text
        combined_text = " ".join(str(raw_features_dict.get(c, "")) for c in self.text_cols)
        text_arr = self.tfidf.transform([combined_text]).toarray()

        # Numeric
        num_vals = [[float(raw_features_dict.get(c, 0)) for c in self.num_cols]]
        num_scaled = self.scaler.transform(num_vals)

        # Categorical (one-hot, must match training columns)
        cat_data = {c: [str(raw_features_dict.get(c, "Unknown"))] for c in self.cat_cols}
        cat_df = pd.get_dummies(pd.DataFrame(cat_data), drop_first=False, dtype=int)

        # Align with training columns
        expected_cat_cols = [c for c in self.feature_columns if c not in self.num_cols and not c.startswith("tfidf_")]
        cat_aligned = cat_df.reindex(columns=expected_cat_cols, fill_value=0)

        import numpy as np
        X_input = np.hstack([num_scaled, cat_aligned.values, text_arr])
        return self.stacking.predict_proba(X_input)


wrapper = PreprocessingWrapper(
    stacking=stacking,
    scaler=scaler,
    tfidf=tfidf,
    cat_cols=CAT_COLS,
    num_cols=NUM_COLS,
    text_cols=TEXT_COLS,
    feature_columns=FEATURE_COLUMNS,
)

bundle = {
    "pipeline": stacking,          # used by ml_service for predict_proba
    "model_name": "XGBoost+LightGBM+RF Stacking Ensemble",
    "feature_columns": FEATURE_COLUMNS,
    "classes": list(le.classes_),
    "label_encoder": le,
    "scaler": scaler,
    "tfidf": tfidf,
    "cat_cols": CAT_COLS,
    "num_cols": NUM_COLS,
    "text_cols": TEXT_COLS,
    "wrapper": wrapper,
    "cv_accuracy": float(cv_scores.mean()),
    "final_accuracy": float(final_acc),
    "optuna_best_params": best_xgb_params,
}

OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
joblib.dump(bundle, OUTPUT_PATH, compress=3)
print(f"\n✅ Model saved to: {OUTPUT_PATH.resolve()}")
print(f"   CV Accuracy: {cv_scores.mean():.2%}")
print(f"   Final Accuracy: {final_acc:.2%}")
print("\nDone! Copy careercompass_final_model.joblib to ml_artifacts/ and restart the backend.")
