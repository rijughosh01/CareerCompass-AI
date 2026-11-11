import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkles,
  BookOpen,
  Code,
  Briefcase,
  Compass,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const POPULAR_SKILLS = [
  'Python', 'Machine Learning', 'SQL', 'Scikit-Learn', 'Deep Learning',
  'JavaScript', 'React', 'Node.js', 'HTML/CSS', 'TypeScript',
  'Java', 'Spring Boot', 'Data Structures', 'Algorithms',
  'AWS', 'Docker', 'Kubernetes', 'Linux', 'DevOps',
  'Cybersecurity', 'Network Security', 'Ethical Hacking', 'Cryptography',
  'UI/UX', 'Figma', 'User Research', 'Wireframing',
  'Product Management', 'Agile', 'Scrum', 'Data Analysis',
  'Pandas', 'Tableau', 'Power BI', 'Statistics',
];

const SOFT_SKILLS = [
  'Problem Solving', 'Critical Thinking', 'Teamwork', 'Communication',
  'Leadership', 'Adaptability', 'Time Management', 'Creativity',
];

const STEPS = [
  { num: 1, title: 'Academic', desc: 'Degree & GPA', icon: BookOpen },
  { num: 2, title: 'Skills', desc: 'Tech & Soft Stack', icon: Code },
  { num: 3, title: 'Interests', desc: 'Focus & Certs', icon: Sparkles },
  { num: 4, title: 'Work Style', desc: 'Culture & Goals', icon: Briefcase },
];

export const CareerAssessment: React.FC = () => {
  const { profile, user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const [assessmentData, setAssessmentData] = useState({
    Highest_Qualification: 'B.Tech',
    Stream: 'CSE',
    Current_Academic_Level: 'Student',
    Grade_CGPA_Percentage: 85.0,
    Technical_Skills: 'Python, SQL, Machine Learning',
    Soft_Skills: 'Problem Solving, Teamwork',
    Languages_Known: 'English',
    Certifications: 'AWS Certified Cloud Practitioner',
    Fields_of_Interest: 'AI/ML',
    Preferred_Work_Style: 'Hybrid',
    Work_Type_Interest: 'Full-time',
    Past_Jobs_Internships: 'ML Intern',
    Achievements: 'Hackathon finalist',
    Skills_Gained: 'Model Deployment, Data Pipelines',
    Willing_to_Relocate: 'Yes',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setAssessmentData((prev) => ({
        ...prev,
        Highest_Qualification: profile.highest_qualification || prev.Highest_Qualification,
        Stream: profile.stream || prev.Stream,
        Current_Academic_Level: profile.current_academic_level || prev.Current_Academic_Level,
        Grade_CGPA_Percentage: profile.grade_cgpa_percentage || prev.Grade_CGPA_Percentage,
        Technical_Skills: profile.technical_skills || prev.Technical_Skills,
        Soft_Skills: profile.soft_skills || prev.Soft_Skills,
        Languages_Known: profile.languages_known || prev.Languages_Known,
        Certifications: profile.certifications || prev.Certifications,
        Fields_of_Interest: profile.fields_of_interest || prev.Fields_of_Interest,
        Preferred_Work_Style: profile.preferred_work_style || prev.Preferred_Work_Style,
        Work_Type_Interest: profile.work_type_interest || prev.Work_Type_Interest,
        Past_Jobs_Internships: profile.past_jobs_internships || prev.Past_Jobs_Internships,
        Achievements: profile.achievements || prev.Achievements,
        Skills_Gained: profile.skills_gained || prev.Skills_Gained,
        Willing_to_Relocate: profile.willing_to_relocate || prev.Willing_to_Relocate,
      }));
    }
  }, [profile]);

  const toggleSkill = (skill: string) => {
    const currentList = assessmentData.Technical_Skills.split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const exists = currentList.some((s) => s.toLowerCase() === skill.toLowerCase());

    const updated = exists
      ? currentList.filter((s) => s.toLowerCase() !== skill.toLowerCase())
      : [...currentList, skill];
    setAssessmentData({ ...assessmentData, Technical_Skills: updated.join(', ') });
  };

  const toggleSoftSkill = (skill: string) => {
    const currentList = assessmentData.Soft_Skills.split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const exists = currentList.some((s) => s.toLowerCase() === skill.toLowerCase());

    const updated = exists
      ? currentList.filter((s) => s.toLowerCase() !== skill.toLowerCase())
      : [...currentList, skill];
    setAssessmentData({ ...assessmentData, Soft_Skills: updated.join(', ') });
  };

  const handleNext = () => {
    setError(null);
    if (step === 1 && !assessmentData.Grade_CGPA_Percentage) {
      setError('Please provide your Grade / CGPA score.');
      return;
    }
    if (step === 2 && !assessmentData.Technical_Skills.trim()) {
      setError('Please select or enter at least one technical skill.');
      return;
    }
    setStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const handlePrev = () => {
    setError(null);
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        full_name: user?.full_name || 'Student',
        highest_qualification: assessmentData.Highest_Qualification,
        stream: assessmentData.Stream,
        current_academic_level: assessmentData.Current_Academic_Level,
        grade_cgpa_percentage: Number(assessmentData.Grade_CGPA_Percentage),
        technical_skills: assessmentData.Technical_Skills,
        soft_skills: assessmentData.Soft_Skills,
        languages_known: assessmentData.Languages_Known,
        certifications: assessmentData.Certifications,
        fields_of_interest: assessmentData.Fields_of_Interest,
        preferred_work_style: assessmentData.Preferred_Work_Style,
        work_type_interest: assessmentData.Work_Type_Interest,
        past_jobs_internships: assessmentData.Past_Jobs_Internships,
        achievements: assessmentData.Achievements,
        skills_gained: assessmentData.Skills_Gained,
        willing_to_relocate: assessmentData.Willing_to_Relocate,
      };
      const response = await api.post('/assessments', payload);
      navigate('/predictions', { state: { result: response.data } });
    } catch (err: any) {
      console.error('Assessment evaluation error:', err);
      const detail = err.response?.data?.detail;
      setError(
        typeof detail === 'string'
          ? detail
          : 'Failed to evaluate assessment with the ML model. Please try again.'
      );
      setSubmitting(false);
    }
  };

  const inputClass =
    'w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all';
  const labelClass = 'block text-xs font-semibold text-slate-700 mb-1.5';

  const selectedTechCount = assessmentData.Technical_Skills.split(',').filter((s) => s.trim()).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-up">
      {/* Page Header */}
      <div className="text-center space-y-2.5">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold border border-brand-200">
          <Compass className="w-3.5 h-3.5 text-brand-600" />
          <span>22-Class XGBoost Evaluation</span>
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Interactive Career Assessment
        </h1>
        <p className="text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
          Complete these 4 steps so our trained classification model can score and rank your strongest career trajectories.
        </p>
      </div>

      {/* Architectural Stepper Card */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-card">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          {STEPS.map((s) => {
            const Icon = s.icon;
            const isCompleted = step > s.num;
            const isCurrent = step === s.num;
            return (
              <button
                key={s.num}
                type="button"
                onClick={() => {
                  if (s.num <= step) setStep(s.num);
                }}
                disabled={s.num > step}
                className={`flex items-center space-x-3 p-3 rounded-xl border text-left transition-all ${
                  isCurrent
                    ? 'bg-brand-50/70 border-brand-500 ring-2 ring-brand-500/15'
                    : isCompleted
                    ? 'bg-emerald-50/50 border-emerald-200 hover:bg-emerald-50 cursor-pointer'
                    : 'bg-slate-50 border-slate-200/70 opacity-60 cursor-not-allowed'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                    isCurrent
                      ? 'bg-brand-600 text-white'
                      : isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                </div>
                <div className="min-w-0">
                  <p
                    className={`text-xs font-bold truncate ${
                      isCurrent ? 'text-brand-800' : isCompleted ? 'text-emerald-900' : 'text-slate-600'
                    }`}
                  >
                    {s.num}. {s.title}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">{s.desc}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Continuous Progress Bar */}
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="font-semibold text-slate-600">Overall Progress</span>
          <span className="font-mono font-bold text-brand-600 tabular-nums">
            {Math.round((step / totalSteps) * 100)}%
          </span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-brand-600 to-indigo-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center space-x-2.5">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Assessment Steps Container */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-card">
        {/* STEP 1: Academic Background */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-up">
            <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-4">
              <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-slate-900">
                  Educational Qualifications
                </h3>
                <p className="text-xs text-slate-500">Provide your current degree and academic standing.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Highest Qualification</label>
                <select
                  value={assessmentData.Highest_Qualification}
                  onChange={(e) =>
                    setAssessmentData({ ...assessmentData, Highest_Qualification: e.target.value })
                  }
                  className={inputClass}
                >
                  <option value="B.Tech">B.Tech</option>
                  <option value="BCA">BCA</option>
                  <option value="B.Sc">B.Sc</option>
                  <option value="M.Tech">M.Tech</option>
                  <option value="MCA">MCA</option>
                  <option value="M.Sc">M.Sc</option>
                  <option value="Diploma">Diploma</option>
                  <option value="PhD">PhD</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Stream / Major</label>
                <select
                  value={assessmentData.Stream}
                  onChange={(e) => setAssessmentData({ ...assessmentData, Stream: e.target.value })}
                  className={inputClass}
                >
                  <option value="CSE">Computer Science &amp; Engineering (CSE)</option>
                  <option value="IT">Information Technology (IT)</option>
                  <option value="ECE">Electronics &amp; Communication (ECE)</option>
                  <option value="Mechanical">Mechanical Engineering</option>
                  <option value="Civil">Civil Engineering</option>
                  <option value="Electrical">Electrical Engineering</option>
                  <option value="Commerce">Commerce / Economics</option>
                  <option value="Arts">Arts / Design</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Current Academic Level</label>
                <select
                  value={assessmentData.Current_Academic_Level}
                  onChange={(e) =>
                    setAssessmentData({ ...assessmentData, Current_Academic_Level: e.target.value })
                  }
                  className={inputClass}
                >
                  <option value="Student">Current Student</option>
                  <option value="Graduate">Recent Graduate</option>
                  <option value="Postgraduate">Postgraduate Scholar</option>
                  <option value="Working Professional">Working Professional</option>
                </select>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-semibold text-slate-700">
                    Grade / CGPA or Percentage
                  </label>
                  <span className="font-mono text-sm font-extrabold text-brand-600 tabular-nums">
                    {assessmentData.Grade_CGPA_Percentage}%
                  </span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="100"
                  step="0.5"
                  value={assessmentData.Grade_CGPA_Percentage}
                  onChange={(e) =>
                    setAssessmentData({
                      ...assessmentData,
                      Grade_CGPA_Percentage: parseFloat(e.target.value),
                    })
                  }
                  className="w-full accent-brand-600 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1.5">
                  <span>40%</span>
                  <span>Distinction (75%)</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Technical & Soft Skills */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-up">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                  <Code className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-slate-900">
                    Technical &amp; Soft Skills
                  </h3>
                  <p className="text-xs text-slate-500">Click tags to toggle or enter custom skills below.</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold border border-brand-200 tabular-nums">
                {selectedTechCount} Selected
              </span>
            </div>

            <div>
              <label className={labelClass}>Technical Skills</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {POPULAR_SKILLS.map((skill) => {
                  const isSelected = assessmentData.Technical_Skills.toLowerCase().includes(
                    skill.toLowerCase()
                  );
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                        isSelected
                          ? 'bg-brand-600 text-white border-brand-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {skill} {isSelected && '✓'}
                    </button>
                  );
                })}
              </div>
              <textarea
                rows={2}
                value={assessmentData.Technical_Skills}
                onChange={(e) =>
                  setAssessmentData({ ...assessmentData, Technical_Skills: e.target.value })
                }
                placeholder="Or type custom comma-separated skills: PyTorch, Tailwind, GraphQL..."
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Soft Skills &amp; Interpersonal Attributes</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {SOFT_SKILLS.map((skill) => {
                  const isSelected = assessmentData.Soft_Skills.toLowerCase().includes(
                    skill.toLowerCase()
                  );
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSoftSkill(skill)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                        isSelected
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {skill} {isSelected && '✓'}
                    </button>
                  );
                })}
              </div>
              <input
                type="text"
                value={assessmentData.Soft_Skills}
                onChange={(e) =>
                  setAssessmentData({ ...assessmentData, Soft_Skills: e.target.value })
                }
                className={inputClass}
              />
            </div>
          </div>
        )}

        {/* STEP 3: Interests & Certifications */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-up">
            <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-4">
              <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-slate-900">
                  Fields of Interest &amp; Certifications
                </h3>
                <p className="text-xs text-slate-500">Help the model weigh your career direction and credentials.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Primary Field of Interest *</label>
                <select
                  value={assessmentData.Fields_of_Interest}
                  onChange={(e) =>
                    setAssessmentData({ ...assessmentData, Fields_of_Interest: e.target.value })
                  }
                  className={inputClass}
                >
                  <option value="AI/ML">AI / Machine Learning</option>
                  <option value="Data Science">Data Science &amp; Big Data</option>
                  <option value="Software Development">Full Stack / Software Development</option>
                  <option value="Cybersecurity">Cybersecurity &amp; Security Operations</option>
                  <option value="Cloud Computing">Cloud Architecture &amp; DevOps</option>
                  <option value="Mobile App Development">Mobile Application Engineering</option>
                  <option value="UI/UX Design">UI/UX &amp; Product Design</option>
                  <option value="IoT/Embedded">IoT, Robotics &amp; Embedded Systems</option>
                  <option value="Blockchain">Blockchain &amp; Smart Contracts</option>
                  <option value="Business/Management">Business Analysis &amp; Management</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Languages Known</label>
                <input
                  type="text"
                  value={assessmentData.Languages_Known}
                  onChange={(e) =>
                    setAssessmentData({ ...assessmentData, Languages_Known: e.target.value })
                  }
                  placeholder="e.g. English, Spanish, German"
                  className={inputClass}
                />
              </div>

              <div className="sm:col-span-2">
                <label className={labelClass}>Certifications Held</label>
                <input
                  type="text"
                  value={assessmentData.Certifications}
                  onChange={(e) =>
                    setAssessmentData({ ...assessmentData, Certifications: e.target.value })
                  }
                  placeholder="e.g. AWS Solutions Architect, Google Professional Data Engineer"
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Work Style & Experience */}
        {step === 4 && (
          <div className="space-y-6 animate-fade-up">
            <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-4">
              <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-slate-900">
                  Work Style &amp; Experiences
                </h3>
                <p className="text-xs text-slate-500">Final workplace preferences and prior hands-on milestones.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Preferred Work Style</label>
                <select
                  value={assessmentData.Preferred_Work_Style}
                  onChange={(e) =>
                    setAssessmentData({ ...assessmentData, Preferred_Work_Style: e.target.value })
                  }
                  className={inputClass}
                >
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="On-site">On-site</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Work Type Interest</label>
                <select
                  value={assessmentData.Work_Type_Interest}
                  onChange={(e) =>
                    setAssessmentData({ ...assessmentData, Work_Type_Interest: e.target.value })
                  }
                  className={inputClass}
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Internship">Internship</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Freelance">Freelance</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Willing to Relocate?</label>
                <select
                  value={assessmentData.Willing_to_Relocate}
                  onChange={(e) =>
                    setAssessmentData({ ...assessmentData, Willing_to_Relocate: e.target.value })
                  }
                  className={inputClass}
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Past Internships or Roles</label>
                <input
                  type="text"
                  value={assessmentData.Past_Jobs_Internships}
                  onChange={(e) =>
                    setAssessmentData({ ...assessmentData, Past_Jobs_Internships: e.target.value })
                  }
                  placeholder="e.g. Frontend Intern, Data Analyst Trainee"
                  className={inputClass}
                />
              </div>

              <div className="sm:col-span-2">
                <label className={labelClass}>Key Achievements / Projects</label>
                <input
                  type="text"
                  value={assessmentData.Achievements}
                  onChange={(e) =>
                    setAssessmentData({ ...assessmentData, Achievements: e.target.value })
                  }
                  placeholder="e.g. Built automated fraud detection pipeline; Hackathon finalist"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Pre-submit Review Pill Bar */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-wrap gap-3 items-center justify-between text-xs">
              <div className="flex flex-wrap gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 font-semibold text-slate-700">
                  {assessmentData.Highest_Qualification} ({assessmentData.Stream})
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 font-mono font-semibold text-brand-600">
                  {assessmentData.Grade_CGPA_Percentage}% Grade
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 font-semibold text-slate-700">
                  {selectedTechCount} Skills
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 font-semibold text-emerald-700">
                  {assessmentData.Fields_of_Interest}
                </span>
              </div>
              <span className="text-slate-500 font-medium">Ready for XGBoost inference</span>
            </div>
          </div>
        )}

        {/* Navigation Controls */}
        <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={handlePrev}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
          ) : (
            <div></div>
          )}

          {step < totalSteps ? (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center space-x-2 px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-brand-600/20 transition-all"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={submitting}
              onClick={handleSubmit}
              className="inline-flex items-center space-x-2 px-7 py-3 bg-gradient-to-r from-brand-600 via-indigo-600 to-brand-700 hover:from-brand-500 hover:to-indigo-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-brand-600/25 transition-all disabled:opacity-50"
            >
              <Compass className={`w-4 h-4 ${submitting ? 'animate-spin' : ''}`} />
              <span>{submitting ? 'Running ML Model...' : 'Generate Career Predictions'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
