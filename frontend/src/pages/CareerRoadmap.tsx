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
} from 'lucide-react';
import api from '../services/api';
import { LearningRoadmap as ILearningRoadmap, RoadmapMilestone } from '../types';

export const CareerRoadmap: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCareer = searchParams.get('career') || 'Machine Learning Engineer';

  const [selectedCareer, setSelectedCareer] = useState<string>(initialCareer);
  const [careerList, setCareerList] = useState<string[]>([]);
  const [roadmap, setRoadmap] = useState<ILearningRoadmap | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeStage, setActiveStage] = useState<string>('Beginner');

  useEffect(() => {
    api
      .get<any[]>('/careers')
      .then((res) => {
        setCareerList(res.data.map((c) => c.name));
      })
      .catch((err) => console.warn('Could not load careers list:', err));
  }, []);

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
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200 mb-2">
            <Milestone className="w-3.5 h-3.5 text-emerald-600" />
            <span>Structured Career Curriculum</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Personalized Learning Roadmap
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Step-by-step 3-stage mastery blueprint with verified courses, target skills, and portfolio capstones.
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
          {/* Overview Banner */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-card">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 mb-4">
              <div>
                <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
                  Target Specialization
                </span>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
                  {roadmap.career}
                </h2>
              </div>
              <div className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold self-start sm:self-auto">
                <Calendar className="w-4 h-4 text-slate-500" />
                <span>Estimated Timeline: {roadmap.estimated_timeline || '6–9 Months'}</span>
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
                  <h3 className="font-display text-base font-bold truncate">{m.stage} Mastery</h3>
                  <p className={`text-xs truncate mt-0.5 ${isCurrent ? 'text-brand-100' : 'text-slate-500'}`}>
                    {m.skills?.length || 0} Core Competencies
                  </p>
                </button>
              );
            })}
          </div>

          {/* Active Stage Detailed Panel */}
          {roadmap.milestones
            .filter((m) => m.stage === activeStage)
            .map((m: RoadmapMilestone) => (
              <div
                key={m.stage}
                className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-card space-y-7 animate-fade-up"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="font-display text-xl font-bold text-slate-900">
                      {m.stage} Stage Milestones
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Recommended duration: <strong className="text-slate-800">{m.duration}</strong>
                    </p>
                  </div>
                  <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold border border-brand-200 self-start sm:self-auto">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Curated Industry Track</span>
                  </div>
                </div>

                {/* Learning Objectives */}
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                    Learning Objectives
                  </h4>
                  <ul className="space-y-2.5">
                    {m.objectives.map((obj, i) => (
                      <li key={i} className="flex items-start text-sm text-slate-700 leading-relaxed">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2.5 shrink-0 mt-1" />
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Target Skills */}
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                    Skills Developed in this Stage
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {m.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-200/80"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Suggested Portfolio Projects */}
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <Code2 className="w-4 h-4 text-brand-600" />
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Portfolio Projects to Build
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {m.suggested_projects.map((proj, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start space-x-3"
                      >
                        <div className="w-8 h-8 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center shrink-0 font-mono font-bold text-xs mt-0.5">
                          #{i + 1}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{proj}</p>
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                            Publish clean modular code on GitHub with tests and a detailed README.
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommended Courses */}
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <BookOpen className="w-4 h-4 text-emerald-600" />
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Verified Courses &amp; Certifications
                    </h4>
                  </div>
                  <div className="space-y-3">
                    {m.recommended_courses.map((course, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-xl border border-slate-200/90 hover:border-brand-300 hover:bg-brand-50/10 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <h5 className="font-display text-sm font-bold text-slate-900">{course.title}</h5>
                            <span className="px-2.5 py-0.5 text-[11px] font-semibold rounded-md bg-brand-50 text-brand-700 border border-brand-200">
                              {course.platform}
                            </span>
                            <span
                              className={`px-2 py-0.5 text-[10px] font-bold rounded-md uppercase ${
                                course.type === 'free'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-purple-50 text-purple-700 border border-purple-200'
                              }`}
                            >
                              {course.type}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">{course.description}</p>
                        </div>

                        <a
                          href={`https://www.google.com/search?q=${encodeURIComponent(
                            `${course.title} ${course.platform}`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-brand-600 text-slate-700 hover:text-white text-xs font-semibold self-start sm:self-center transition-all shrink-0"
                        >
                          <span>Explore</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
        </div>
      ) : null}
    </div>
  );
};
