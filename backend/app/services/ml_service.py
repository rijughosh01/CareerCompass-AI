import os
import sys
import logging
from typing import Dict, Any, List
import pandas as pd
import numpy as np
import joblib

# Ensure preprocessing_utils is importable
current_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.dirname(os.path.dirname(current_dir))
root_dir = os.path.dirname(backend_dir)
ml_artifacts_dir = os.path.join(root_dir, "ml_artifacts")
ml_backend_dir = os.path.join(os.path.dirname(current_dir), "ml")

for d in [ml_artifacts_dir, ml_backend_dir]:
    if d not in sys.path:
        sys.path.insert(0, d)

try:
    import preprocessing_utils
except ImportError as e:
    logging.warning(f"Could not import preprocessing_utils directly: {e}")

from app.core.config import settings
from app.services.career_data import CAREER_KNOWLEDGE_BASE

logger = logging.getLogger(__name__)


class CareerPredictionService:
    def __init__(self):
        self.model_bundle = None
        self.pipeline = None
        self.classes = []
        self.feature_columns = []
        self.model_loaded = False
        self._load_model()

    def _load_model(self):
        """Loads the trained ML pipeline and bundle from disk."""
        model_path = settings.MODEL_PATH
        if not os.path.exists(model_path):
            alt_path = os.path.join(ml_artifacts_dir, "careercompass_final_model.joblib")
            if os.path.exists(alt_path):
                model_path = alt_path

        if not os.path.exists(model_path):
            logger.error(f"ML Model file not found at: {model_path}")
            self.model_loaded = False
            return

        try:
            bundle = joblib.load(model_path)
            self.model_bundle = bundle
            self.pipeline = bundle["pipeline"]
            self.classes = bundle.get("classes", [])
            self.feature_columns = bundle.get("feature_columns", [])
            self.model_loaded = True
            logger.info(f"Loaded ML model '{bundle.get('model_name')}' with {len(self.classes)} classes.")
        except Exception as e:
            logger.error(f"Failed to load ML model from {model_path}: {e}")
            self.model_loaded = False

    def predict_career(self, student_profile: Dict[str, Any], top_n: int = 5) -> List[Dict[str, Any]]:
        """
        Accepts a student profile dictionary, constructs the feature vector,
        and returns Top-N career predictions enriched with descriptions,
        required skills, market opportunities, and match explanations.
        """
        if not self.model_loaded or self.pipeline is None:
            raise RuntimeError(
                "Career prediction model is not available. Please verify that "
                "'ml_artifacts/careercompass_final_model.joblib' is present."
            )

        # Standardize and map keys if snake_case was passed
        key_mapping = {
            "highest_qualification": "Highest_qualification",
            "stream": "Stream",
            "current_academic_level": "Current_Academic_Level",
            "grade_cgpa_percentage": "Grade_CGPA_Percentage",
            "technical_skills": "Technical_Skills",
            "soft_skills": "Soft_Skills",
            "languages_known": "Languages_Known",
            "certifications": "Certifications",
            "fields_of_interest": "Fields_of_Interest",
            "preferred_work_style": "Preferred_Work_Style",
            "work_type_interest": "Work_Type_Interest",
            "past_jobs_internships": "Past_Jobs_Internships",
            "achievements": "Achievements",
            "skills_gained": "Skills_Gained",
            "willing_to_relocate": "Willing_to_Relocate",
        }

        normalized_profile = {}
        for k, v in student_profile.items():
            mapped_key = key_mapping.get(k, k)
            normalized_profile[mapped_key] = v

        row_data = {}
        for col in self.feature_columns:
            val = normalized_profile.get(col, "")
            if pd.isna(val) or val is None:
                val = "" if col != "Grade_CGPA_Percentage" else 75.0
            row_data[col] = [val]

        df_input = pd.DataFrame(row_data)

        # Predict probabilities
        try:
            probabilities = self.pipeline.predict_proba(df_input)[0]
        except Exception as e:
            logger.error(f"Error during predict_proba: {e}")
            raise RuntimeError(f"Prediction failed: {e}")

        top_indices = np.argsort(probabilities)[::-1][:top_n]

        results = []
        for rank, idx in enumerate(top_indices, 1):
            career_name = self.classes[idx]
            raw_score = float(probabilities[idx])
            percentage = round(raw_score * 100, 2)

            # Enrich from career knowledge base
            kb = CAREER_KNOWLEDGE_BASE.get(career_name, {})
            desc = kb.get("description", f"Specialized professional career pathway in {career_name}.")
            req_skills = kb.get("required_technical_skills", []) + kb.get("required_soft_skills", [])
            opportunities = kb.get("opportunities", ["Industry Specialist", "Senior Consultant", "Technical Lead"])
            explanation = kb.get("explanation", f"Your profile alignment indicates suitability for {career_name}.")

            results.append({
                "rank": rank,
                "career": career_name,
                "prediction_score": percentage,
                "raw_probability": raw_score,
                "is_top_match": rank == 1,
                "description": desc,
                "required_skills": req_skills,
                "career_opportunities": opportunities,
                "match_explanation": explanation
            })

        return results


# Global singleton instance
ml_service = CareerPredictionService()
