"""
CareerCompass AI - ML Preprocessing Utilities
=============================================
Contains tokenizers and utility functions used by the Scikit-learn
preprocessing pipeline and CountVectorizer.
"""

import pandas as pd
import xgboost as xgb

# Compatibility guard for scikit-learn 1.6+ with XGBoost
if hasattr(xgb.sklearn.XGBModel, "_more_tags"):
    try:
        from sklearn.utils._tags import get_tags
        get_tags(xgb.XGBClassifier())
    except Exception:
        try:
            delattr(xgb.sklearn.XGBModel, "_more_tags")
        except Exception:
            pass


def comma_tokenizer(text):
    """
    Tokenizes comma-delimited strings (e.g. skills, certifications, languages)
    into clean, trimmed, lowercase tokens.
    """
    if pd.isna(text):
        return []
    return [
        item.strip().lower()
        for item in str(text).split(",")
        if item.strip()
    ]
