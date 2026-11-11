import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  FileCheck2,
  GitCompare,
  Milestone,
  FileText,
  Bot,
  User,
  ArrowRight,
  Sparkles,
  BookOpen,
  GraduationCap,
} from 'lucide-react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { AssessmentResult } from '../types';

export const StudentDashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const [latestAssessment, setLatestAssessment] = useState<AssessmentResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await api.get<any>('/assessments/latest');
        if (
          res.data &&
          res.data.has_assessment !== false &&
          (res.data.top_prediction || res.data.top_career)
        ) {
          setLatestAssessment({
            ...res.data,
            top_prediction: res.data.top_prediction || res.data.top_career,
          });
        } else {
          setLatestAssessment(null);
        }
      } catch (err) {
        console.warn('No previous assessment found:', err);
        setLatestAssessment(null);
      } finally {
        setLoading(false);
      }
    };
    fetchLatest();
  }, []);

  // Compute profile completeness
  const profileFields = [
    profile?.highest_qualification,
    profile?.stream,
    profile?.grade_cgpa_percentage,
    profile?.technical_skills,
    profile?.soft_skills,
    profile?.fields_of_interest,
    profile?.preferred_work_style,
  ];
  const filledCount = profileFields.filter(Boolean).length;
  const profileCompleteness = Math.round((filledCount / profileFields.length) * 100);

  // Recharts readiness radar data
  const readinessData = [
    { subject: 'Technical Core', score: profile?.technical_skills ? 85 : 40, fullMark: 100 },
    { subject: 'Soft Skills', score: profile?.soft_skills ? 80 : 35, fullMark: 100 },
    {
      subject: 'Academic Merit',
      score: profile?.grade_cgpa_percentage
        ? Math.min(Math.round(profile.grade_cgpa_percentage), 100)
        : 50,
      fullMark: 100,
    },
    { subject: 'Specialization', score: profile?.fields_of_interest ? 90 : 30, fullMark: 100 },
    { subject: 'Work Experience', score: profile?.past_jobs_internships ? 85 : 45, fullMark: 100 },
  ];

  const topScore = latestAssessment?.predictions?.[0]?.prediction_score ?? 98.4;

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Executive Welcome Hero */}
      <div className="bg-slate-950 rounded-2xl p-6 sm:p-8 text-white shadow-elevated relative overflow-hidden border border-slate-800">
        <div className="absolute inset-0 bg-grid-dark pointer-events-none"></div>
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-brand-600/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-brand-500/15 text-brand-300 text-xs font-semibold border border-brand-400/25">
                <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                <span>Student Intelligence Hub</span>
              </span>
              {profile?.highest_qualification && profile?.stream && (
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700">
                  <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    {profile.highest_qualification} • {profile.stream}
                  </span>
                </span>
              )}
            </div>

            <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.full_name || 'Student'}
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              Track your ML career alignment, identify high-ROI skill upgrades, and navigate your personalized roadmap toward your target engineering or technology career.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0">
            <Link
              to="/assessment"
              className="inline-flex items-center justify-center space-x-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-sm font-semibold shadow-md shadow-brand-600/25 transition-all"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>{latestAssessment ? 'Retake Assessment' : 'Start Assessment'}</span>
            </Link>
            <Link
              to="/profile"
              className="inline-flex items-center justify-center space-x-2 px-5 py-2.5 bg-white/10 hover:bg-white/15 text-white rounded-xl text-sm font-semibold border border-white/15 transition-all"
            >
              <User className="w-4 h-4" />
              <span>Edit Profile</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Top KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Top Predicted Career */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Top Predicted Career
              </span>
              <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 border border-brand-100 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>

            {loading ? (
              <div className="space-y-3 animate-pulse">
                <div className="h-6 bg-slate-100 rounded-lg w-3/4"></div>
                <div className="h-4 bg-slate-100 rounded-lg w-1/2"></div>
                <div className="h-2 bg-slate-100 rounded-full w-full"></div>
              </div>
            ) : latestAssessment ? (
              <div>
                <h3 className="font-display text-lg font-bold text-slate-900 mb-2 truncate">
                  {latestAssessment.top_prediction}
                </h3>
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 tabular-nums">
                    {Number(topScore).toFixed(1)}% Match
                  </span>
                  <span className="text-xs text-slate-500">XGBoost Rank #1</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-brand-600 to-indigo-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(Number(topScore), 100)}%` }}
                  ></div>
                </div>
              </div>
            ) : (
              <div className="py-2">
                <p className="text-sm text-slate-500 mb-3">
                  Complete your 4-step career evaluation to unlock ML predictions.
                </p>
              </div>
            )}
          </div>

          <div className="mt-5 pt-3.5 border-t border-slate-100">
            <Link
              to={latestAssessment ? '/predictions' : '/assessment'}
              className="inline-flex items-center text-xs font-bold text-brand-600 hover:text-brand-700 group"
            >
              <span>{latestAssessment ? 'View All Ranked Predictions' : 'Take Assessment Now'}</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Card 2: Profile Completeness */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Profile Completeness
              </span>
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline space-x-2 mb-3">
              <span className="font-display text-3xl font-extrabold text-slate-900 tabular-nums">
                {profileCompleteness}%
              </span>
              <span className="text-xs text-slate-500">
                ({filledCount} / {profileFields.length} fields)
              </span>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-2 mb-3">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  profileCompleteness >= 80
                    ? 'bg-emerald-500'
                    : profileCompleteness >= 50
                    ? 'bg-amber-500'
                    : 'bg-brand-500'
                }`}
                style={{ width: `${profileCompleteness}%` }}
              ></div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              {profileCompleteness >= 80
                ? 'Strong profile coverage for sharper ML inference.'
                : 'Add technical skills and certifications for higher precision.'}
            </p>
          </div>

          <div className="mt-5 pt-3.5 border-t border-slate-100">
            <Link
              to="/profile"
              className="inline-flex items-center text-xs font-bold text-brand-600 hover:text-brand-700 group"
            >
              <span>Update Profile Credentials</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Card 3: Academic Background */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Academic Snapshot
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 text-xs">Qualification</span>
                <span className="font-semibold text-slate-900 text-xs">
                  {profile?.highest_qualification || 'Not set'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 text-xs">Stream</span>
                <span className="font-semibold text-slate-900 text-xs">
                  {profile?.stream || 'Not set'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 text-xs">Grade / CGPA</span>
                <span className="font-mono font-bold text-emerald-600 text-xs tabular-nums">
                  {profile?.grade_cgpa_percentage ? `${profile.grade_cgpa_percentage}%` : 'Not set'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 text-xs">Primary Interest</span>
                <span className="font-semibold text-brand-600 text-xs truncate max-w-[140px]">
                  {profile?.fields_of_interest || 'Technology'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3.5 border-t border-slate-100">
            <Link
              to="/profile"
              className="inline-flex items-center text-xs font-bold text-brand-600 hover:text-brand-700 group"
            >
              <span>Review Full Academic Record</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Analytics & Tools Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Readiness Radar Chart */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card lg:col-span-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-display text-base font-bold text-slate-900">
                Career Readiness Radar
              </h3>
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                5 Dimensions
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Multi-factor competency profile derived from your academic and skill attributes.
            </p>

            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="72%" data={readinessData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 11, fontWeight: 500 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 9 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      border: 'none',
                      borderRadius: '10px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Radar
                    name="Readiness Score"
                    dataKey="score"
                    stroke="#4f46e5"
                    strokeWidth={2}
                    fill="#6366f1"
                    fillOpacity={0.28}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Primary Advantage</span>
            <span className="font-semibold text-brand-600">
              {profile?.technical_skills ? 'Technical Stack Readiness' : 'Academic Foundation'}
            </span>
          </div>
        </div>

        {/* Career Tools & Launchpad */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card lg:col-span-7">
          <div className="mb-5">
            <h3 className="font-display text-base font-bold text-slate-900">
              Career Intelligence Modules
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Launch interactive tools to evaluate readiness, bridge gaps, and optimize applications.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                title: 'Career Assessment',
                desc: '4-step wizard powered by our 22-class XGBoost model.',
                path: '/assessment',
                icon: FileCheck2,
                iconBg: 'bg-brand-50 text-brand-600 border-brand-100',
                hoverBorder: 'hover:border-brand-400 hover:bg-brand-50/20',
              },
              {
                title: 'Skill Gap Analyzer',
                desc: `Benchmark missing skills for ${latestAssessment?.top_prediction || 'target roles'}.`,
                path: '/skill-gap',
                icon: GitCompare,
                iconBg: 'bg-indigo-50 text-indigo-600 border-indigo-100',
                hoverBorder: 'hover:border-indigo-400 hover:bg-indigo-50/20',
              },
              {
                title: 'Learning Roadmap',
                desc: '3-stage mastery plan with courses & project capstones.',
                path: '/roadmap',
                icon: Milestone,
                iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
                hoverBorder: 'hover:border-emerald-400 hover:bg-emerald-50/20',
              },
              {
                title: 'ATS Resume Scanner',
                desc: 'Upload PDF/DOCX to compute your 0–100 ATS score.',
                path: '/resume',
                icon: FileText,
                iconBg: 'bg-amber-50 text-amber-600 border-amber-100',
                hoverBorder: 'hover:border-amber-400 hover:bg-amber-50/20',
              },
            ].map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.title}
                  to={tool.path}
                  className={`group p-4 rounded-xl border border-slate-200/90 transition-all ${tool.hoverBorder}`}
                >
                  <div className="flex items-start space-x-3.5">
                    <div
                      className={`w-10 h-10 rounded-xl border ${tool.iconBg} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-display text-sm font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                          {tool.title}
                        </h4>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-brand-500 group-hover:translate-x-0.5 transition-all" />
                      </div>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{tool.desc}</p>
                    </div>
                  </div>
                </Link>
              );
            })}

            {/* Full-width AI Counselor Card */}
            <Link
              to="/chat"
              className="group p-4 rounded-xl border border-slate-200/90 hover:border-purple-400 hover:bg-purple-50/20 transition-all sm:col-span-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3.5">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-display text-sm font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                        24/7 AI Career Counselor
                      </h4>
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-purple-100 text-purple-700">
                        Interactive Mentor
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Get personalized transition blueprints, portfolio ideas, and mock interview prep grounded in your profile.
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-3" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
