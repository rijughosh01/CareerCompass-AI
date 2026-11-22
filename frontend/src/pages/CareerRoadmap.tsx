import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Milestone,
  CheckCircle2,
  ExternalLink,
  Calendar,
  Sparkles,
  BookOpen,
  Code2,
  Award,
  CheckSquare,
  Square,
  Trophy,
  X,
  Share2,
} from 'lucide-react';
import api from '../services/api';
import { LearningRoadmap as ILearningRoadmap, RoadmapMilestone, RoadmapProgressSummary } from '../types';
import { useAuth } from '../context/AuthContext';

export const CareerRoadmap: React.FC = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCareer = searchParams.get('career') || 'Machine Learning Engineer';

  const [selectedCareer, setSelectedCareer] = useState<string>(initialCareer);
  const [careerList, setCareerList] = useState<string[]>([]);
  const [roadmap, setRoadmap] = useState<ILearningRoadmap | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeStage, setActiveStage] = useState<string>('Beginner');

  // Interactive Checklist Progress State
  const [progress, setProgress] = useState<RoadmapProgressSummary | null>(null);
  const [showCertificate, setShowCertificate] = useState(false);

  useEffect(() => {
    api
      .get<any[]>('/careers')
      .then((res) => {
        setCareerList(res.data.map((c) => c.name));
      })
      .catch((err) => console.warn('Could not load careers list:', err));
  }, []);

  const loadProgress = (careerName: string) => {
    api
      .get<RoadmapProgressSummary>(`/roadmaps/progress?career=${encodeURIComponent(careerName)}`)
      .then((res) => setProgress(res.data))
      .catch((err) => console.warn('Could not load roadmap progress:', err));
  };

  useEffect(() => {
    setLoading(true);
    api
      .get<ILearningRoadmap>(`/roadmaps?career=${encodeURIComponent(selectedCareer)}`)
      .then((res) => {
        setRoadmap(res.data);
        if (res.data.milestones && res.data.milestones.length > 0) {
          setActiveStage(res.data.milestones[0].stage);
        }
      })
      .catch((err) => console.error('Error fetching roadmap:', err))
      .finally(() => setLoading(false));

    loadProgress(selectedCareer);
  }, [selectedCareer]);

  const handleCareerChange = (careerName: string) => {
    setSelectedCareer(careerName);
    setSearchParams({ career: careerName });
  };

  const isItemCompleted = (stage: string, itemType: string, itemTitle: string): boolean => {
    if (!progress || !progress.completed_items) return false;
    const key = `${stage}:${itemType}:${itemTitle}`;
    return progress.completed_items.includes(key);
  };

  const handleToggleItem = async (stage: string, itemType: string, itemTitle: string) => {
    const key = `${stage}:${itemType}:${itemTitle}`;
    const currentlyDone = isItemCompleted(stage, itemType, itemTitle);
    const newStatus = !currentlyDone;

    // Optimistic UI update
    if (progress) {
      const updatedKeys = newStatus
        ? [...progress.completed_items, key]
        : progress.completed_items.filter((k) => k !== key);
      setProgress({
        ...progress,
        completed_items: updatedKeys,
        completed_count: updatedKeys.length,
        readiness_percentage: Math.round((updatedKeys.length / Math.max(progress.total_items, 1)) * 100),
      });
    }

    try {
      const res = await api.post<RoadmapProgressSummary>('/roadmaps/progress/toggle', {
        career: selectedCareer,
        stage,
        item_type: itemType,
        item_title: itemTitle,
        completed: newStatus,
      });
      setProgress(res.data);
    } catch (err) {
      console.error('Error toggling progress:', err);
      // Re-fetch on error
      loadProgress(selectedCareer);
    }
  };

  const readinessScore = progress?.readiness_percentage || 0;

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-up">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-slate-200/80">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200 mb-2">
            <Milestone className="w-3.5 h-3.5 text-emerald-600" />
            <span>Interactive Curriculum & Progress Tracker</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Personalized Learning Roadmap
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Check off completed skills, projects, and courses to track your real-time career readiness score and unlock certification.
          </p>
        </div>

        {/* Career Selector Dropdown */}
        <div className="w-full sm:w-72">
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Selected Career Roadmap
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
            <Milestone className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-700">Synthesizing Milestone Roadmap...</p>
        </div>
      ) : roadmap ? (
        <div className="space-y-6">
          {/* Overview & Live Readiness Tracker Banner */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-card space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
                  Target Specialization
                </span>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
                  {roadmap.career}
                </h2>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold">
                  <Calendar className="w-4 h-4 text-slate-500" />
                  <span>Timeline: {roadmap.estimated_timeline || '6–9 Months'}</span>
                </div>
                {readinessScore >= 70 && (
                  <button
                    type="button"
                    onClick={() => setShowCertificate(true)}
                    className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-amber-500/10 text-amber-700 border border-amber-300 text-xs font-bold hover:bg-amber-500/20 transition-all shadow-2xs"
                  >
                    <Trophy className="w-4 h-4 text-amber-600" />
                    <span>View Career Ready Certificate</span>
                  </button>
                )}
              </div>
            </div>

            {/* Interactive Progress Meter */}
            <div className="space-y-2 p-4 rounded-xl bg-slate-50 border border-slate-200/70">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Award className="w-4 h-4 text-brand-600" />
                  <span className="text-xs font-bold text-slate-800">
                    Real-Time Career Readiness Score
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <span className="font-extrabold text-slate-900 text-sm">
                    {readinessScore}%
                  </span>
                  <span className="text-slate-500">
                    ({progress?.completed_count || 0} of {progress?.total_items || 0} completed)
                  </span>
                </div>
              </div>

              <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brand-600 via-indigo-600 to-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(0, readinessScore))}%` }}
                />
              </div>

              <div className="flex justify-between items-center text-[11px] text-slate-500 pt-1">
                <span>Novice Learner</span>
                <span>Milestone Intermediate (40%)</span>
                <span className={readinessScore >= 70 ? 'font-bold text-emerald-600' : ''}>
                  Job Ready (70%+) 🏆
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              {roadmap.overview ||
                'This structured roadmap outlines progressive technical competencies, hands-on engineering milestones, and industry-standard portfolio projects required for competitive entry into this field.'}
            </p>
          </div>

          {/* Stage Selector Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {roadmap.milestones.map((m: RoadmapMilestone, idx: number) => {
              const isCurrent = activeStage === m.stage;
              const stagePct = progress?.stage_readiness?.[m.stage] || 0;
              return (
                <button
                  key={m.stage}
                  type="button"
                  onClick={() => setActiveStage(m.stage)}
                  className={`p-4 sm:p-5 rounded-2xl border text-left transition-all ${
                    isCurrent
                      ? 'bg-brand-600 text-white border-brand-600 shadow-md shadow-brand-600/25 ring-2 ring-brand-500/20'
                      : 'bg-white text-slate-700 border-slate-200/80 shadow-2xs hover:border-brand-300 hover:bg-slate-50/70'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                        isCurrent ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      Stage {idx + 1}
                    </span>
                    <span className={`text-xs font-medium ${isCurrent ? 'text-brand-100' : 'text-slate-400'}`}>
                      {m.duration}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-base mb-1">{m.stage} Stage</h3>
                  <div className="flex items-center justify-between text-xs mt-2">
                    <span className={isCurrent ? 'text-brand-100' : 'text-slate-500'}>
                      {stagePct}% Completed
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Detailed Stage Content */}
          {roadmap.milestones
            .filter((m: RoadmapMilestone) => m.stage === activeStage)
            .map((milestone: RoadmapMilestone) => (
              <div key={milestone.stage} className="space-y-6">
                {/* 1. Stage Learning Objectives */}
                {milestone.objectives && milestone.objectives.length > 0 && (
                  <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs">
                    <div className="flex items-center space-x-2 text-slate-900 font-bold mb-4">
                      <Sparkles className="w-5 h-5 text-brand-600" />
                      <h3 className="text-base font-bold">Key Objectives for this Stage</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {milestone.objectives.map((obj, i) => (
                        <div
                          key={i}
                          className="flex items-start space-x-3 p-3 rounded-xl bg-slate-50 border border-slate-100"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                          <span className="text-xs font-medium text-slate-700 leading-relaxed">{obj}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. Interactive Skills Checklist */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2 text-slate-900 font-bold">
                      <Code2 className="w-5 h-5 text-brand-600" />
                      <h3 className="text-base font-bold">Target Technical Competencies (Click to check off)</h3>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                    {milestone.skills.map((skill) => {
                      const done = isItemCompleted(milestone.stage, 'skill', skill);
                      return (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => handleToggleItem(milestone.stage, 'skill', skill)}
                          className={`flex items-center space-x-2.5 p-3 rounded-xl text-left border transition-all ${
                            done
                              ? 'bg-emerald-50/80 border-emerald-300 text-emerald-900'
                              : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          {done ? (
                            <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-400 shrink-0" />
                          )}
                          <span
                            className={`text-xs font-semibold ${
                              done ? 'line-through text-slate-500' : 'text-slate-800'
                            }`}
                          >
                            {skill}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Interactive Suggested Projects Checklist */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs">
                  <div className="flex items-center space-x-2 text-slate-900 font-bold mb-4">
                    <Code2 className="w-5 h-5 text-indigo-600" />
                    <h3 className="text-base font-bold">Hands-On Portfolio Capstones</h3>
                  </div>
                  <div className="space-y-3">
                    {milestone.suggested_projects.map((proj, pIdx) => {
                      const done = isItemCompleted(milestone.stage, 'project', proj);
                      return (
                        <div
                          key={pIdx}
                          className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                            done
                              ? 'bg-emerald-50/70 border-emerald-300'
                              : 'bg-slate-50/70 border-slate-200/80'
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <button
                              type="button"
                              onClick={() => handleToggleItem(milestone.stage, 'project', proj)}
                              className="mt-0.5"
                            >
                              {done ? (
                                <CheckSquare className="w-4 h-4 text-emerald-600" />
                              ) : (
                                <Square className="w-4 h-4 text-slate-400" />
                              )}
                            </button>
                            <div>
                              <p className={`text-xs font-bold ${done ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                                {proj}
                              </p>
                              <p className="text-[11px] text-slate-500 mt-0.5">
                                Add to your GitHub portfolio and link in your verified resume builder.
                              </p>
                            </div>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                              done ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {done ? 'Completed' : 'Pending'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Interactive Verified Course Recommendations */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs">
                  <div className="flex items-center space-x-2 text-slate-900 font-bold mb-4">
                    <BookOpen className="w-5 h-5 text-emerald-600" />
                    <h3 className="text-base font-bold">Recommended Learning Resources & Courses</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {milestone.recommended_courses.map((course, cIdx) => {
                      const done = isItemCompleted(milestone.stage, 'course', course.title);
                      return (
                        <div
                          key={cIdx}
                          className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                            done
                              ? 'bg-emerald-50/50 border-emerald-300'
                              : 'bg-white border-slate-200/80 hover:border-brand-300'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-brand-50 text-brand-700 border border-brand-100">
                                {course.platform}
                              </span>
                              <span
                                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                  course.type === 'free'
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : 'bg-amber-50 text-amber-700'
                                }`}
                              >
                                {course.type === 'free' ? 'Free Resource' : 'Certification'}
                              </span>
                            </div>
                            <h4
                              className={`font-semibold text-xs mb-1 ${
                                done ? 'line-through text-slate-500' : 'text-slate-900'
                              }`}
                            >
                              {course.title}
                            </h4>
                            <p className="text-[11px] text-slate-500 leading-relaxed mb-3">
                              {course.description}
                            </p>
                          </div>

                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                            <button
                              type="button"
                              onClick={() => handleToggleItem(milestone.stage, 'course', course.title)}
                              className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-brand-600"
                            >
                              {done ? (
                                <>
                                  <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>Completed</span>
                                </>
                              ) : (
                                <>
                                  <Square className="w-3.5 h-3.5 text-slate-400" />
                                  <span>Mark Complete</span>
                                </>
                              )}
                            </button>
                            <a
                              href={`https://www.google.com/search?q=${encodeURIComponent(
                                course.title + ' ' + course.platform
                              )}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center space-x-1 text-xs font-semibold text-brand-600 hover:text-brand-700"
                            >
                              <span>Explore</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
        </div>
      ) : null}

      {/* Career Ready Certificate Modal */}
      {showCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-xl bg-gradient-to-b from-slate-900 to-slate-950 text-white border-2 border-amber-500/40 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6 text-center">
            <button
              type="button"
              onClick={() => setShowCertificate(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/30 mx-auto">
              <Trophy className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400">
                Official Credential of Completion
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
                Career Ready Certificate
              </h2>
              <p className="text-xs text-slate-400">
                Verified Career Readiness in {selectedCareer}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/90 border border-amber-500/20 space-y-3 text-sm">
              <p className="text-slate-300">
                This certifies that <strong className="text-white text-base">{user?.full_name || 'Alex Morgan'}</strong> has
                successfully mastered {progress?.completed_count || 0} core technical competencies, capstone projects, and verified
                curricula for:
              </p>
              <p className="text-lg font-bold text-amber-400">{selectedCareer}</p>
              <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-800">
                <span>Issued: {new Date().toLocaleDateString()}</span>
                <span>Verification ID: CC-{selectedCareer.slice(0, 3).toUpperCase()}-{Math.floor(100000 + Math.random() * 900000)}</span>
              </div>
            </div>

            <div className="flex justify-center space-x-3">
              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="px-5 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-500 shadow-md"
              >
                Print / Save PDF
              </button>
              <button
                type="button"
                onClick={() => setShowCertificate(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
