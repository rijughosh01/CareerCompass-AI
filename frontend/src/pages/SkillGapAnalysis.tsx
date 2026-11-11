import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  GitCompare,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Milestone,
  Sparkles,
  ArrowRight,
  UserCheck,
} from 'lucide-react';
import api from '../services/api';
import { SkillGapAnalysis as ISkillGapAnalysis } from '../types';

export const SkillGapAnalysis: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCareer = searchParams.get('career') || 'Machine Learning Engineer';

  const [selectedCareer, setSelectedCareer] = useState<string>(initialCareer);
  const [careerList, setCareerList] = useState<string[]>([]);
  const [gapData, setGapData] = useState<ISkillGapAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<any[]>('/careers')
      .then((res) => {
        const names = res.data.map((c) => c.name);
        setCareerList(names);
      })
      .catch((err) => console.warn('Could not load careers list:', err));
  }, []);

  useEffect(() => {
    setLoading(true);
    api
      .get<ISkillGapAnalysis>(`/skills/gap?career=${encodeURIComponent(selectedCareer)}`)
      .then((res) => {
        setGapData(res.data);
      })
      .catch((err) => {
        console.error('Error fetching skill gap:', err);
      })
      .finally(() => setLoading(false));
  }, [selectedCareer]);

  const handleCareerChange = (careerName: string) => {
    setSelectedCareer(careerName);
    setSearchParams({ career: careerName });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-up">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-slate-200/80">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-200 mb-2">
            <GitCompare className="w-3.5 h-3.5 text-indigo-600" />
            <span>Target Competency Benchmark</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Skill Gap Analysis
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Benchmark your recorded skills against target career requirements to prioritize upgrades.
          </p>
        </div>

        {/* Career Selector Dropdown */}
        <div className="w-full sm:w-72">
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Target Career Path
          </label>
          <select
            value={selectedCareer}
            onChange={(e) => handleCareerChange(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-medium text-slate-900 shadow-2xs focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          >
            {careerList.length > 0 ? (
              careerList.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))
            ) : (
              <option value={selectedCareer}>{selectedCareer}</option>
            )}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="w-12 h-12 rounded-2xl bg-brand-600 flex items-center justify-center text-white shadow-lg shadow-brand-600/25 animate-pulse mb-4">
            <GitCompare className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-700">Evaluating Skill Coverage...</p>
        </div>
      ) : gapData ? (
        <div className="space-y-6">
          {/* Top Metric & Readiness Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-card">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Coverage Radial Circle */}
              <div className="md:col-span-5 flex items-center space-x-5 md:border-r md:border-slate-100 md:pr-6">
                <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-100"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className={
                        gapData.coverage_percentage >= 75
                          ? 'text-emerald-500'
                          : gapData.coverage_percentage >= 50
                          ? 'text-brand-500'
                          : 'text-amber-500'
                      }
                      strokeDasharray={`${gapData.coverage_percentage}, 100`}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute text-center">
                    <span className="font-mono text-xl font-extrabold text-slate-900 tabular-nums">
                      {gapData.coverage_percentage}%
                    </span>
                    <span className="block text-[9px] uppercase font-bold text-slate-400">Match</span>
                  </div>
                </div>

                <div>
                  <span
                    className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full mb-1.5 ${
                      gapData.coverage_percentage >= 75
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : gapData.coverage_percentage >= 50
                        ? 'bg-brand-50 text-brand-700 border border-brand-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {gapData.coverage_percentage >= 75
                      ? 'High Readiness'
                      : gapData.coverage_percentage >= 50
                      ? 'Moderate Readiness'
                      : 'Developing Foundation'}
                  </span>
                  <h3 className="font-display text-lg font-bold text-slate-900">{gapData.career}</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {gapData.coverage_percentage >= 75
                      ? 'Focus on advanced system design & portfolio capstones.'
                      : gapData.coverage_percentage >= 50
                      ? 'Bridge 2–3 core domain tools to become interview-ready.'
                      : 'Follow Stage 1 fundamentals in your learning roadmap.'}
                  </p>
                </div>
              </div>

              {/* Acquired vs Missing Counts */}
              <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-xl bg-emerald-50/60 border border-emerald-200/80">
                  <div className="flex items-center space-x-2 text-emerald-800 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold uppercase tracking-wider">Acquired Skills</span>
                  </div>
                  <p className="font-display text-3xl font-extrabold text-emerald-950 tabular-nums">
                    {gapData.existing_skills?.length || 0}
                  </p>
                  <p className="text-xs text-emerald-700 mt-1">Verified in your student profile</p>
                </div>

                <div className="p-5 rounded-xl bg-rose-50/60 border border-rose-200/80">
                  <div className="flex items-center space-x-2 text-rose-800 mb-2">
                    <XCircle className="w-4 h-4 text-rose-600" />
                    <span className="text-xs font-bold uppercase tracking-wider">Missing Skills</span>
                  </div>
                  <p className="font-display text-3xl font-extrabold text-rose-950 tabular-nums">
                    {gapData.missing_skills?.length || 0}
                  </p>
                  <p className="text-xs text-rose-700 mt-1">Recommended next competencies</p>
                </div>
              </div>
            </div>
          </div>

          {/* Skill Breakdown Lists */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Acquired Skills Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 mb-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-display text-base font-bold text-slate-900">
                    Skills You Already Have
                  </h3>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-600 tabular-nums">
                  {gapData.existing_skills?.length || 0}
                </span>
              </div>

              {gapData.existing_skills && gapData.existing_skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {gapData.existing_skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200/80 inline-flex items-center"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mr-1.5 shrink-0" />
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2">
                  <p className="text-sm text-slate-600">
                    No matching competencies recorded for this role yet.
                  </p>
                  <Link
                    to="/profile"
                    className="inline-flex items-center space-x-1.5 text-xs font-bold text-brand-600 hover:text-brand-700"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Add skills in My Profile</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Missing Skills Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 mb-4">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  <h3 className="font-display text-base font-bold text-slate-900">
                    Priority Skills to Acquire
                  </h3>
                </div>
                <span className="text-xs font-mono font-bold text-rose-600 tabular-nums">
                  {gapData.missing_skills?.length || 0}
                </span>
              </div>

              {gapData.missing_skills && gapData.missing_skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {gapData.missing_skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-800 text-xs font-semibold border border-rose-200/80 inline-flex items-center"
                    >
                      <XCircle className="w-3.5 h-3.5 text-rose-600 mr-1.5 shrink-0" />
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium">
                  Excellent! You meet all primary technical prerequisites recorded for {gapData.career}.
                </div>
              )}
            </div>
          </div>

          {/* CTA Banner */}
          <div className="bg-slate-950 rounded-2xl p-6 sm:p-8 text-white shadow-elevated relative overflow-hidden border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="absolute inset-0 bg-grid-dark pointer-events-none"></div>
            <div className="relative z-10">
              <div className="flex items-center space-x-2 text-brand-300 text-xs font-bold uppercase tracking-wider mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                <span>Accelerate Your Skill Acquisition</span>
              </div>
              <h3 className="font-display text-xl font-bold">Ready to close these skill gaps?</h3>
              <p className="text-sm text-slate-300 max-w-xl mt-1 leading-relaxed">
                Follow our structured 3-stage curriculum for {gapData.career}, complete with verified courses and portfolio project prompts.
              </p>
            </div>

            <Link
              to={`/roadmap?career=${encodeURIComponent(gapData.career)}`}
              className="relative z-10 inline-flex items-center space-x-2 px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-sm font-semibold shadow-md shadow-brand-600/25 transition-all shrink-0"
            >
              <Milestone className="w-4 h-4" />
              <span>Open {gapData.career} Roadmap</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
};
