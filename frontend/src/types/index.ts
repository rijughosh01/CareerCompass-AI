export type UserRole = 'student' | 'admin';

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: UserRole;
  created_at: string;
}

export interface StudentProfile {
  id?: number;
  user_id?: number;
  full_name: string;
  age?: number;
  gender?: string;
  location?: string;
  highest_qualification: string;
  stream: string;
  current_academic_level: string;
  grade_cgpa_percentage: number;
  technical_skills: string;
  soft_skills: string;
  languages_known: string;
  certifications?: string;
  fields_of_interest: string;
  preferred_work_style: string;
  work_type_interest: string;
  past_jobs_internships?: string;
  achievements?: string;
  skills_gained?: string;
  willing_to_relocate: string;
  updated_at?: string;
}

export interface CareerPredictionItem {
  rank: number;
  career: string;
  prediction_score: number;
  raw_probability: number;
  is_top_match: boolean;
  description?: string;
  required_skills?: string[];
  career_opportunities?: string[];
  match_explanation?: string;
}

export interface AssessmentResult {
  id: number;
  created_at: string;
  top_prediction: string;
  predictions: CareerPredictionItem[];
  profile_snapshot: StudentProfile;
}

export interface SkillGapItem {
  skill: string;
  status: 'acquired' | 'missing' | 'in_progress';
  importance: 'critical' | 'recommended' | 'optional';
  category: 'technical' | 'soft';
}

export interface SkillGapAnalysis {
  career: string;
  coverage_percentage: number;
  existing_skills: string[];
  missing_skills: string[];
  recommended_skills: string[];
  breakdown: SkillGapItem[];
}

export interface RoadmapMilestone {
  stage: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  objectives: string[];
  skills: string[];
  suggested_projects: string[];
  recommended_courses: {
    title: string;
    platform: string;
    description: string;
    type: 'free' | 'certification';
  }[];
}

export interface LearningRoadmap {
  career: string;
  overview: string;
  estimated_timeline: string;
  milestones: RoadmapMilestone[];
}

export interface ResumeAnalysisResult {
  extracted_skills: string[];
  education_level: string;
  overall_score: number;
  matching_careers: string[];
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  keywords_found: string[];
  missing_keywords: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface AdminStats {
  total_students: number;
  total_assessments: number;
  top_careers: { name: string; count: number }[];
  recent_activity: {
    id: number;
    user_name: string;
    action: string;
    timestamp: string;
  }[];
}

