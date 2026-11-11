from typing import Dict, Any
from app.services.career_data import CAREER_KNOWLEDGE_BASE


def generate_career_roadmap(career_name: str) -> Dict[str, Any]:
    """
    Retrieves or synthesizes a structured 3-stage learning roadmap for a target career:
    - Beginner, Intermediate, and Advanced milestones
    - Measurable learning objectives
    - Practical hands-on projects
    - Verified course recommendations (freeCodeCamp, Coursera, HarvardX, etc.)
    """
    kb = CAREER_KNOWLEDGE_BASE.get(career_name)
    if kb and "roadmap" in kb:
        rm = kb["roadmap"]
        return {
            "career": career_name,
            "overview": kb.get("description", f"Structured path towards becoming a {career_name}."),
            "estimated_timeline": rm.get("timeline", "6 to 8 Months"),
            "milestones": rm.get("milestones", [])
        }

    # Fallback generic structured roadmap if career not in knowledge base
    return {
        "career": career_name,
        "overview": f"Comprehensive skill development roadmap for {career_name}.",
        "estimated_timeline": "6 Months",
        "milestones": [
            {
                "stage": "Beginner",
                "duration": "Months 1-2",
                "objectives": ["Master core foundational concepts and terminology", "Learn primary tools and programming languages"],
                "skills": ["Foundational Tools", "Git & Version Control", "Basic Problem Solving"],
                "suggested_projects": ["Introductory Portfolio Project", "Documentation & Workflow Setup"],
                "recommended_courses": [
                    {"title": "Foundational Specialization", "platform": "Coursera", "description": "Core industry fundamentals.", "type": "certification"}
                ]
            },
            {
                "stage": "Intermediate",
                "duration": "Months 3-4",
                "objectives": ["Build real-world end-to-end applications", "Implement industry best practices and automated testing"],
                "skills": ["Intermediate Frameworks", "API Design", "Testing"],
                "suggested_projects": ["Production-Ready Application Portfolio"],
                "recommended_courses": [
                    {"title": "Practical Industry Skills", "platform": "freeCodeCamp", "description": "Hands-on projects.", "type": "free"}
                ]
            },
            {
                "stage": "Advanced",
                "duration": "Months 5-6",
                "objectives": ["Master scalable architecture and performance tuning", "Prepare for professional industry certifications"],
                "skills": ["System Architecture", "Cloud Deployment", "Optimization"],
                "suggested_projects": ["Full-Scale Capstone Project"],
                "recommended_courses": [
                    {"title": "Advanced Engineering Certificate", "platform": "edX", "description": "Advanced capstone certification.", "type": "certification"}
                ]
            }
        ]
    }

