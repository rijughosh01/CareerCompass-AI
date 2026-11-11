import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  TrendingUp,
  GitCompare,
  Milestone,
  Bot,
  AlertCircle,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  BarChart3,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
} from 'recharts';
import api from '../services/api';
import { AssessmentResult, CareerPredictionItem } from '../types';

export const CareerPrediction: React.FC = () => {
  const location = useLocation();
  const [assessment, setAssessment] = useState<AssessmentResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stateResult = (location.state as any)?.result;
    if (stateResult && stateResult.predictions && stateResult.predictions.length > 0) {
      setAssessment(stateResult);
      setLoading(false);
    } else {
      api
        .get<any>('/assessments/latest')
        .then((res) => {
          if (
            res.data &&
            res.data.has_assessment !== false &&
            res.data.predictions &&
            res.data.predictions.length > 0
          ) {
            setAssessment(res.data);
          } else {
            setAssessment(null);
          }
        })
        .catch((err) => {
          console.warn('Error loading predictions:', err);
          setAssessment(null);
        })
        .finally(() => setLoading(false));
    }
  }, [location.state]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="w-12 h-12 rounded-2xl bg-brand-600 flex items-center justify-center text-white shadow-lg shadow-brand-600/25 animate-pulse mb-4">
          <TrendingUp className="w-6 h-6" />
        </div>
        <p className="text-sm font-semibold text-slate-700">Loading AI Career Predictions...</p>
      </div>
    );
  }

  if (!assessment || !assessment.predictions || assessment.predictions.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-10 border border-slate-200/80 shadow-card text-center max-w-lg mx-auto my-12 space-y-4">
        <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto border border-brand-100">
          <TrendingUp className="w-6 h-6" />
        </div>
        <h2 className="font-display text-xl font-bold text-slate-900">No Assessment Found</h2>
        <p className="text-sm text-slate-500 leading-relaxed">
          You haven't completed a career assessment yet. Complete the 4-step evaluation to receive ranked ML career predictions.
        </p>
        <Link
          to="/assessment"
          className="inline-flex items-center space-x-2 px-6 py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-xl shadow-md shadow-brand-600/20 hover:bg-brand-700 transition-all"
        >
          <span>Start Assessment Now</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const chartData = assessment.predictions.map((p) => ({
    name: p.career,
    score: Number(p.prediction_score.toFixed(1)),
  }));

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-up">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200/80">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>XGBoost Multi-Class Assessment Results</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Career Suitability Predictions
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Top ranked career categories matching your academic background, skills, and work preferences.
          </p>
        </div>

        <Link
          to="/assessment"
          className="inline-flex items-center justify-center px-4 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-semibold shadow-2xs transition-all self-start sm:self-auto"
        >
          Retake Assessment
        </Link>
      </div>

      {/* Ethical AI Disclaimer */}
      <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/90 text-amber-900 flex items-start space-x-3">
        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-bold text-amber-950">Guidance &amp; Explainability Notice</p>
          <p className="mt-0.5 leading-relaxed text-xs text-amber-800">
            Model scores represent machine-learning affinity ratings derived from academic and skill patterns. They are designed strictly for educational guidance and do not constitute guaranteed job offers or employment probabilities.
          </p>
        </div>
      </div>

      {/* Score Comparison Chart */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4 text-brand-600" />
            <h2 className="font-display text-base font-bold text-slate-900">
              Ranked Affinity Comparison
            </h2>
          </div>
          <span className="text-xs font-medium text-slate-500">Top {chartData.length} Careers (%)</span>
        </div>

        <div className="w-full h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 4, right: 24, left: 10, bottom: 4 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} unit="%" />
              <YAxis
                type="category"
                dataKey="name"
                width={175}
                tick={{ fontSize: 12, fill: '#334155', fontWeight: 600 }}
              />
              <Tooltip
                formatter={(val: any) => [`${val}%`, 'Affinity Score']}
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: 'none',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="score" radius={[0, 8, 8, 0]} barSize={22}>
                {chartData.map((_, idx) => (
                  <Cell
                    key={idx}
                    fill={idx === 0 ? '#4f46e5' : idx === 1 ? '#6366f1' : '#94a3b8'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Ranked Career Cards */}
      <div className="space-y-5">
        {assessment.predictions.map((item: CareerPredictionItem, idx: number) => {
          const isTop = idx === 0;

          return (
            <div
              key={item.career}
              className={`rounded-2xl p-6 sm:p-8 transition-all border ${
                isTop
                  ? 'bg-gradient-to-br from-white via-brand-50/20 to-white border-brand-300 shadow-card-hover ring-1 ring-brand-500/15'
                  : 'bg-white border-slate-200/80 shadow-card hover:shadow-card-hover'
              }`}
            >
              {/* Header row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div className="flex items-center space-x-3.5">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center font-display font-extrabold text-sm shrink-0 ${
                      isTop
                        ? 'bg-brand-600 text-white shadow-md shadow-brand-600/25'
                        : idx === 1
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    #{item.rank || idx + 1}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900">
                        {item.career}
                      </h3>
                      {isTop && (
                        <span className="px-2.5 py-0.5 text-[11px] font-bold uppercase bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200">
                          Top Match
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {isTop ? 'Highest statistical affinity across evaluated features' : `Ranked Option #${idx + 1}`}
                    </p>
                  </div>
                </div>

                {/* Score Badge */}
                <div className="inline-flex items-center space-x-2 bg-slate-100/80 px-4 py-2 rounded-xl border border-slate-200 self-start sm:self-center shrink-0">
                  <span className="text-xs text-slate-600 font-semibold">Match Score</span>
                  <span className="font-mono text-base font-extrabold text-brand-600 tabular-nums">
                    {item.prediction_score.toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 rounded-full h-2.5 mb-5 overflow-hidden">
                <div
                  className={`h-2.5 rounded-full transition-all duration-700 ${
                    isTop
                      ? 'bg-gradient-to-r from-brand-600 to-indigo-500'
                      : idx === 1
                      ? 'bg-indigo-500'
                      : 'bg-slate-400'
                  }`}
                  style={{ width: `${Math.min(item.prediction_score, 100)}%` }}
                ></div>
              </div>

              {/* Description */}
              <p className="text-sm text-slate-600 leading-relaxed mb-5">
                {item.description ||
                  'Professional role requiring specialization in contemporary engineering paradigms and continuous skill development.'}
              </p>

              {/* Match Rationale */}
              {item.match_explanation && (
                <div className="mb-5 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center space-x-2 text-xs font-bold text-slate-800 mb-1.5">
                    <ShieldCheck className="w-4 h-4 text-brand-600" />
                    <span>Why This Fits Your Profile</span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{item.match_explanation}</p>
                </div>
              )}

              {/* Required Skills & Opportunities */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 mb-6">
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                    Key Competencies Required
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {(item.required_skills && item.required_skills.length > 0
                      ? item.required_skills
                      : ['Technical Core', 'Analytical Reasoning', 'Problem Solving', 'System Design']
                    ).map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200/80"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                    Industry Pathways
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {(item.career_opportunities && item.career_opportunities.length > 0
                      ? item.career_opportunities
                      : ['Enterprise Software', 'AI Research Labs', 'Tech Startups']
                    ).map((opp) => (
                      <span
                        key={opp}
                        className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-medium border border-emerald-200 inline-flex items-center"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mr-1.5" />
                        {opp}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-3">
                <Link
                  to={`/skill-gap?career=${encodeURIComponent(item.career)}`}
                  className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-all"
                >
                  <GitCompare className="w-3.5 h-3.5" />
                  <span>Analyze Skill Gap</span>
                </Link>

                <Link
                  to={`/roadmap?career=${encodeURIComponent(item.career)}`}
                  className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-semibold border border-indigo-200 transition-all"
                >
                  <Milestone className="w-3.5 h-3.5" />
                  <span>View Learning Roadmap</span>
                </Link>

                <Link
                  to={`/chat?context=${encodeURIComponent(item.career)}`}
                  className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold border border-slate-200 transition-all"
                >
                  <Bot className="w-3.5 h-3.5 text-brand-600" />
                  <span>Ask AI Counselor</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
