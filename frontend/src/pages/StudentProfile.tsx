import React, { useState, useEffect } from 'react';
import {
  User,
  BookOpen,
  Code,
  Briefcase,
  Award,
  Save,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { StudentProfile as IStudentProfile } from '../types';

export const StudentProfile: React.FC = () => {
  const { profile, updateProfile } = useAuth();

  const [formData, setFormData] = useState<Partial<IStudentProfile>>({
    full_name: '',
    age: 22,
    gender: 'Prefer not to say',
    location: '',
    highest_qualification: 'B.Tech',
    stream: 'CSE',
    current_academic_level: 'Student',
    grade_cgpa_percentage: 85.0,
    technical_skills: '',
    soft_skills: '',
    languages_known: 'English',
    certifications: '',
    fields_of_interest: 'AI/ML',
    preferred_work_style: 'Hybrid',
    work_type_interest: 'Full-time',
    past_jobs_internships: '',
    achievements: '',
    skills_gained: '',
    willing_to_relocate: 'Yes',
  });

  const [activeTab, setActiveTab] = useState<'personal' | 'academic' | 'skills' | 'preferences' | 'experience'>('personal');
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        age: profile.age ?? 22,
        gender: profile.gender || 'Prefer not to say',
        location: profile.location || '',
        highest_qualification: profile.highest_qualification || 'B.Tech',
        stream: profile.stream || 'CSE',
        current_academic_level: profile.current_academic_level || 'Student',
        grade_cgpa_percentage: profile.grade_cgpa_percentage ?? 85.0,
        technical_skills: profile.technical_skills || '',
        soft_skills: profile.soft_skills || '',
        languages_known: profile.languages_known || 'English',
        certifications: profile.certifications || '',
        fields_of_interest: profile.fields_of_interest || 'AI/ML',
        preferred_work_style: profile.preferred_work_style || 'Hybrid',
        work_type_interest: profile.work_type_interest || 'Full-time',
        past_jobs_internships: profile.past_jobs_internships || '',
        achievements: profile.achievements || '',
        skills_gained: profile.skills_gained || '',
        willing_to_relocate: profile.willing_to_relocate || 'Yes',
      });
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'age' || name === 'grade_cgpa_percentage' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      await updateProfile(formData);
      setSuccessMessage('Profile updated successfully! Future ML predictions and counselor replies are now grounded in your latest details.');
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err: any) {
      console.error('Failed to update profile:', err);
      setErrorMessage(err.response?.data?.detail || 'Failed to save profile. Please verify your inputs.');
    } finally {
      setSaving(false);
    }
  };

  const keyAttrs = [
    formData.full_name,
    formData.highest_qualification,
    formData.stream,
    formData.grade_cgpa_percentage,
    formData.technical_skills,
    formData.soft_skills,
    formData.fields_of_interest,
    formData.preferred_work_style,
  ];
  const completeness = Math.round((keyAttrs.filter(Boolean).length / keyAttrs.length) * 100);

  const navTabs = [
    { id: 'personal', label: 'Personal Details', icon: User },
    { id: 'academic', label: 'Academic Record', icon: BookOpen },
    { id: 'skills', label: 'Skills & Certs', icon: Code },
    { id: 'preferences', label: 'Work Preferences', icon: Briefcase },
    { id: 'experience', label: 'Experience & Awards', icon: Award },
  ] as const;

  const inputClass =
    'w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all';
  const labelClass = 'block text-xs font-semibold text-slate-700 mb-1.5';

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fade-up">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200/80">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Student Profile Settings
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Keep your academic qualifications, technical competencies, and preferences updated for accurate ML scoring.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          className="inline-flex items-center justify-center space-x-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-brand-600/20 transition-all disabled:opacity-50 self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving Changes...' : 'Save Profile'}</span>
        </button>
      </div>

      {/* Feedback Alerts */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm flex items-center space-x-3 shadow-2xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-sm flex items-center space-x-3 shadow-2xs">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Settings Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Navigation & Completeness Sidebar */}
        <div className="lg:col-span-3 space-y-4">
          {/* Completeness Meter Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Strength</span>
              <span className="font-mono text-sm font-bold text-brand-600 tabular-nums">{completeness}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 mb-2.5">
              <div
                className="bg-gradient-to-r from-brand-600 to-emerald-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${completeness}%` }}
              ></div>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Complete sections help ground both ML career predictions and AI Counselor advice.
            </p>
          </div>

          {/* Section Tabs */}
          <nav className="flex lg:flex-col gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all shrink-0 text-left ${
                    isActive
                      ? 'bg-brand-50 text-brand-700 border border-brand-200 shadow-2xs'
                      : 'bg-white lg:bg-transparent text-slate-600 hover:bg-white hover:text-slate-900 border border-slate-200/70 lg:border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-brand-600' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Form Card */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-9 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-card space-y-6"
        >
          {/* TAB 1: Personal Info */}
          {activeTab === 'personal' && (
            <div className="space-y-5 animate-fade-up">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-display text-lg font-bold text-slate-900">Personal Information</h3>
                <p className="text-xs text-slate-500 mt-0.5">Basic demographic &amp; contact identity details.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Full Name *</label>
                  <input
                    type="text"
                    required
                    name="full_name"
                    value={formData.full_name || ''}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Age</label>
                  <input
                    type="number"
                    min="16"
                    max="60"
                    name="age"
                    value={formData.age || 22}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Gender</label>
                  <select
                    name="gender"
                    value={formData.gender || 'Prefer not to say'}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Location / City</label>
                  <input
                    type="text"
                    name="location"
                    placeholder="e.g. San Francisco, CA or Remote"
                    value={formData.location || ''}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Academic Background */}
          {activeTab === 'academic' && (
            <div className="space-y-5 animate-fade-up">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-display text-lg font-bold text-slate-900">Academic Background</h3>
                <p className="text-xs text-slate-500 mt-0.5">Educational credentials used as core ML features.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Highest Qualification *</label>
                  <select
                    name="highest_qualification"
                    value={formData.highest_qualification || 'B.Tech'}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="High School">High School</option>
                    <option value="Diploma">Diploma</option>
                    <option value="BCA">BCA</option>
                    <option value="B.Sc">B.Sc</option>
                    <option value="B.Tech">B.Tech</option>
                    <option value="MCA">MCA</option>
                    <option value="M.Sc">M.Sc</option>
                    <option value="M.Tech">M.Tech</option>
                    <option value="PhD">PhD</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Academic Stream *</label>
                  <select
                    name="stream"
                    value={formData.stream || 'CSE'}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="CSE">Computer Science &amp; Engineering (CSE)</option>
                    <option value="IT">Information Technology (IT)</option>
                    <option value="ECE">Electronics &amp; Communication (ECE)</option>
                    <option value="Mechanical">Mechanical Engineering</option>
                    <option value="Civil">Civil Engineering</option>
                    <option value="Electrical">Electrical Engineering</option>
                    <option value="Commerce">Commerce / Finance</option>
                    <option value="Arts">Arts / Design / Humanities</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Current Academic Level</label>
                  <select
                    name="current_academic_level"
                    value={formData.current_academic_level || 'Student'}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="Student">Current Student</option>
                    <option value="Graduate">Recent Graduate</option>
                    <option value="Postgraduate">Postgraduate Scholar</option>
                    <option value="Working Professional">Working Professional</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Grade / CGPA or Percentage (0–100) *</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    name="grade_cgpa_percentage"
                    value={formData.grade_cgpa_percentage || 85.0}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Skills & Languages */}
          {activeTab === 'skills' && (
            <div className="space-y-5 animate-fade-up">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-display text-lg font-bold text-slate-900">Technical &amp; Soft Skills</h3>
                <p className="text-xs text-slate-500 mt-0.5">Comma-separated competencies analyzed by the Skill Gap Engine.</p>
              </div>

              <div>
                <label className={labelClass}>Technical Skills (Comma separated) *</label>
                <textarea
                  name="technical_skills"
                  rows={3}
                  placeholder="Python, SQL, Machine Learning, Scikit-learn, React, Git, Docker"
                  value={formData.technical_skills || ''}
                  onChange={handleChange}
                  className={inputClass}
                />
                <p className="text-xs text-slate-500 mt-1.5">
                  Tip: Include concrete frameworks and languages (e.g., Python, PyTorch, React, AWS, SQL).
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Soft Skills (Comma separated) *</label>
                  <input
                    type="text"
                    name="soft_skills"
                    placeholder="Problem Solving, Communication, Teamwork"
                    value={formData.soft_skills || ''}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Languages Known (Comma separated)</label>
                  <input
                    type="text"
                    name="languages_known"
                    placeholder="English, Spanish, Hindi"
                    value={formData.languages_known || ''}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Certifications (Comma separated)</label>
                <input
                  type="text"
                  name="certifications"
                  placeholder="AWS Certified Cloud Practitioner, TensorFlow Developer Certificate"
                  value={formData.certifications || ''}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>
          )}

          {/* TAB 4: Work Preferences */}
          {activeTab === 'preferences' && (
            <div className="space-y-5 animate-fade-up">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-display text-lg font-bold text-slate-900">Career &amp; Work Preferences</h3>
                <p className="text-xs text-slate-500 mt-0.5">Alignment factors for target work culture and domains.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Fields of Interest *</label>
                  <select
                    name="fields_of_interest"
                    value={formData.fields_of_interest || 'AI/ML'}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="AI/ML">AI / Machine Learning</option>
                    <option value="Data Science">Data Science &amp; Analytics</option>
                    <option value="Software Development">Software &amp; Web Development</option>
                    <option value="Cybersecurity">Cybersecurity &amp; Forensics</option>
                    <option value="Cloud Computing">Cloud &amp; DevOps</option>
                    <option value="Mobile App Development">Mobile Application Development</option>
                    <option value="UI/UX Design">UI/UX &amp; Product Design</option>
                    <option value="IoT/Embedded">IoT &amp; Embedded Systems</option>
                    <option value="Blockchain">Blockchain &amp; Web3</option>
                    <option value="Business/Management">Business &amp; Management</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Preferred Work Style</label>
                  <select
                    name="preferred_work_style"
                    value={formData.preferred_work_style || 'Hybrid'}
                    onChange={handleChange}
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
                    name="work_type_interest"
                    value={formData.work_type_interest || 'Full-time'}
                    onChange={handleChange}
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
                    name="willing_to_relocate"
                    value={formData.willing_to_relocate || 'Yes'}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Experience & Projects */}
          {activeTab === 'experience' && (
            <div className="space-y-5 animate-fade-up">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-display text-lg font-bold text-slate-900">Experience &amp; Achievements</h3>
                <p className="text-xs text-slate-500 mt-0.5">Internships, competitions, and practical engineering output.</p>
              </div>
              <div>
                <label className={labelClass}>Past Jobs, Internships, or Open-Source Contributions</label>
                <textarea
                  name="past_jobs_internships"
                  rows={2}
                  placeholder="e.g. ML Intern at TechLabs, Open-source contributor to Scikit-learn"
                  value={formData.past_jobs_internships || ''}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Achievements, Hackathons, or Awards</label>
                <textarea
                  name="achievements"
                  rows={2}
                  placeholder="e.g. Winner at Smart India Hackathon 2024, Published paper at IEEE"
                  value={formData.achievements || ''}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Practical Skills Gained from Projects</label>
                <input
                  type="text"
                  name="skills_gained"
                  placeholder="e.g. End-to-end model deployment, REST API design, Docker"
                  value={formData.skills_gained || ''}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>
          )}

          {/* Form Footer */}
          <div className="pt-5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-2 text-xs text-slate-500">
              <Sparkles className="w-4 h-4 text-brand-500 shrink-0" />
              <span>Changes synchronize automatically with future ML predictions and AI counseling.</span>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center space-x-2 px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-brand-600/20 transition-all disabled:opacity-50 shrink-0"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save All Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
