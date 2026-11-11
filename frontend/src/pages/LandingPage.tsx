import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  BrainCircuit,
  GitCompare,
  Milestone,
  FileText,
  Bot,
  ShieldCheck,
  CheckCircle2,
  BarChart3,
  Users,
  Lightbulb,
  Cpu,
  Target,
  Award,
} from 'lucide-react';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-slate-900">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-slate-950 text-white pt-14 pb-20 lg:pt-20 lg:pb-28">
        {/* Ambient Mesh & Architectural Grid */}
        <div className="absolute inset-0 bg-grid-dark pointer-events-none"></div>
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[900px] h-[480px] bg-brand-600/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-brand-500/15 border border-brand-400/25 text-brand-300 text-xs font-semibold mb-6 backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                <span>AI-Powered Career Intelligence &amp; Guidance</span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
                Discover Your Future.{' '}
                <span className="bg-gradient-to-r from-brand-300 via-indigo-200 to-white bg-clip-text text-transparent">
                  Build Your Career with AI.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 mb-8 leading-relaxed">
                Analyze your academic background, technical proficiencies, and interests with our
                22-class XGBoost engine. Receive ranked career recommendations, precise skill gap
                breakdowns, and step-by-step learning roadmaps.
              </p>

              {/* Primary CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 mb-12">
                <Link
                  to="/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-7 py-3.5 text-sm font-bold text-white bg-brand-600 rounded-xl hover:bg-brand-500 shadow-lg shadow-brand-600/30 transition-all hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 text-sm font-semibold text-slate-200 bg-white/10 hover:bg-white/15 rounded-xl border border-white/15 transition-all backdrop-blur-sm"
                >
                  Sign In / Demo Access
                </Link>
              </div>

              {/* Clean Metric Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-slate-800/90 text-left">
                <div>
                  <p className="font-display text-2xl font-extrabold text-white tabular-nums">89.8%</p>
                  <p className="text-xs text-slate-400 mt-0.5">Test Accuracy</p>
                </div>
                <div>
                  <p className="font-display text-2xl font-extrabold text-brand-300 tabular-nums">22</p>
                  <p className="text-xs text-slate-400 mt-0.5">Career Paths</p>
                </div>
                <div>
                  <p className="font-display text-2xl font-extrabold text-emerald-400 tabular-nums">15K+</p>
                  <p className="text-xs text-slate-400 mt-0.5">Student Profiles</p>
                </div>
                <div>
                  <p className="font-display text-2xl font-extrabold text-indigo-300 tabular-nums">100%</p>
                  <p className="text-xs text-slate-400 mt-0.5">Explainable AI</p>
                </div>
              </div>
            </div>

            {/* Right Interactive Product Preview Card */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-elevated p-5 sm:p-6 backdrop-blur-xl">
                {/* Window Bar */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
                  </div>
                  <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-mono text-emerald-300">
                    <Cpu className="w-3 h-3" />
                    <span>XGBoost Inference Live</span>
                  </div>
                </div>

                {/* Top Career Match Preview */}
                <div className="space-y-3.5">
                  <div className="p-4 rounded-xl bg-slate-950/90 border border-brand-500/40 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 rounded-md bg-brand-600 text-white text-[10px] font-bold">
                          #1 MATCH
                        </span>
                        <span className="font-display text-sm font-bold text-white">
                          Machine Learning Engineer
                        </span>
                      </div>
                      <span className="font-mono text-sm font-bold text-emerald-400 tabular-nums">
                        96.4%
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2 mb-2.5">
                      <div className="bg-gradient-to-r from-brand-500 to-emerald-400 h-2 rounded-full w-[96.4%]"></div>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {['Python', 'Scikit-Learn', 'SQL', 'XGBoost'].map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px] font-medium border border-slate-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Secondary Matches */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-semibold text-slate-400">#2 Rank</span>
                        <span className="font-mono text-xs font-bold text-indigo-300 tabular-nums">88.2%</span>
                      </div>
                      <p className="text-xs font-bold text-white truncate">Data Scientist</p>
                      <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2">
                        <div className="bg-indigo-500 h-1.5 rounded-full w-[88.2%]"></div>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-semibold text-slate-400">#3 Rank</span>
                        <span className="font-mono text-xs font-bold text-purple-300 tabular-nums">82.5%</span>
                      </div>
                      <p className="text-xs font-bold text-white truncate">AI Researcher</p>
                      <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2">
                        <div className="bg-purple-500 h-1.5 rounded-full w-[82.5%]"></div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Telemetry Row */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center space-x-2.5">
                      <Target className="w-4 h-4 text-emerald-400 shrink-0" />
                      <div>
                        <p className="text-[10px] uppercase font-bold text-emerald-300">Skill Coverage</p>
                        <p className="text-xs font-bold text-white tabular-nums">85% Ready</p>
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center space-x-2.5">
                      <Award className="w-4 h-4 text-amber-400 shrink-0" />
                      <div>
                        <p className="text-[10px] uppercase font-bold text-amber-300">ATS Score</p>
                        <p className="text-xs font-bold text-white tabular-nums">92 / 100</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-20 lg:py-24 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">
              4-Step Intelligence Pipeline
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 mb-4 tracking-tight">
              How CareerCompass AI Works
            </h2>
            <p className="text-slate-600 text-base leading-relaxed">
              From raw academic records to an actionable career roadmap in minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {/* Connector Line (Desktop) */}
            <div className="hidden md:block absolute top-11 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-brand-200 via-indigo-200 to-purple-200 z-0"></div>

            {[
              {
                step: '01',
                title: 'Profile & Assessment',
                desc: 'Enter your education, CGPA, technical skills, soft skills, and preferences in our guided 4-step wizard.',
                accent: 'bg-brand-600 text-white shadow-brand-600/25',
              },
              {
                step: '02',
                title: 'ML Model Scoring',
                desc: 'Our multi-class XGBoost classifier evaluates feature interactions to rank your Top 3–5 career matches.',
                accent: 'bg-indigo-600 text-white shadow-indigo-600/25',
              },
              {
                step: '03',
                title: 'Skill Gap & Roadmap',
                desc: 'Inspect missing critical skills and follow a 3-stage curriculum with verified courses and projects.',
                accent: 'bg-emerald-600 text-white shadow-emerald-600/25',
              },
              {
                step: '04',
                title: 'ATS Resume & AI Coach',
                desc: 'Benchmark your resume against target roles and consult the grounded 24/7 AI Career Counselor.',
                accent: 'bg-purple-600 text-white shadow-purple-600/25',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="relative z-10 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all"
              >
                <div
                  className={`w-11 h-11 rounded-xl ${item.accent} flex items-center justify-center font-display font-extrabold text-sm mb-5 shadow-md`}
                >
                  {item.step}
                </div>
                <h3 className="font-display text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* KEY FEATURES GRID */}
      <section id="features" className="py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">
              Platform Capabilities
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 mb-4 tracking-tight">
              Everything You Need for Career Clarity
            </h2>
            <p className="text-slate-600 text-base leading-relaxed">
              Built with industry-grade machine learning and crafted for students, graduates, and institutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: BrainCircuit,
                iconBg: 'bg-brand-50 text-brand-600 border-brand-100',
                title: 'Top 3–5 ML Career Predictions',
                desc: 'Receive ranked predictions across 22 specialized careers with model affinity scores and transparent match explanations.',
                bullets: ['89.8% XGBoost test accuracy', 'Explainable match rationales'],
              },
              {
                icon: GitCompare,
                iconBg: 'bg-indigo-50 text-indigo-600 border-indigo-100',
                title: 'Dynamic Skill Gap Analysis',
                desc: 'Compare your current skill inventory against industry prerequisites with percentage readiness gauges.',
                bullets: ['Acquired vs. missing breakdown', 'Priority learning targets'],
              },
              {
                icon: Milestone,
                iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
                title: '3-Stage Learning Roadmaps',
                desc: 'Follow structured Beginner, Intermediate, and Advanced milestones curated with courses and portfolio capstones.',
                bullets: ['Curated courses & certifications', 'Real-world project blueprints'],
              },
              {
                icon: FileText,
                iconBg: 'bg-amber-50 text-amber-600 border-amber-100',
                title: 'ATS Resume Analyzer',
                desc: 'Upload PDF/DOCX resumes or paste text to inspect keyword coverage, strengths, and optimization steps.',
                bullets: ['Instant 0–100 ATS score', 'Missing role keyword detection'],
              },
              {
                icon: Bot,
                iconBg: 'bg-purple-50 text-purple-600 border-purple-100',
                title: '24/7 AI Career Counselor',
                desc: 'Converse with an intelligent mentor grounded in your academic profile, skills, and target career roles.',
                bullets: ['Transition & interview coaching', 'Role comparisons & salary outlook'],
              },
              {
                icon: BarChart3,
                iconBg: 'bg-sky-50 text-sky-600 border-sky-100',
                title: 'Administrative Telemetry',
                desc: 'Dedicated admin portal to monitor student cohorts, track assessment trends, and inspect career distributions.',
                bullets: ['Interactive cohort charts', 'Role-based access control'],
              },
            ].map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  className="group p-7 rounded-2xl border border-slate-200/80 bg-white shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200"
                >
                  <div
                    className={`w-12 h-12 rounded-xl border ${feat.iconBg} flex items-center justify-center mb-5 group-hover:scale-105 transition-transform`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-slate-900 mb-2.5">{feat.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-5">{feat.desc}</p>
                  <ul className="space-y-2 border-t border-slate-100 pt-4">
                    {feat.bullets.map((b) => (
                      <li key={b} className="flex items-center text-xs font-medium text-slate-600">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2 shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* WHY CAREERCOMPASS / ADVANTAGE SECTION */}
      <section id="benefits" className="py-20 lg:py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-dark pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6">
              <span className="text-xs font-bold text-brand-400 uppercase tracking-widest">
                The CareerCompass Advantage
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white mt-2 mb-5 leading-tight tracking-tight">
                Traditional Quizzes vs. Machine Learning Precision
              </h2>
              <p className="text-slate-300 text-base mb-8 leading-relaxed">
                Generic personality quizzes output vague job titles without explaining the reasoning or
                providing an execution plan. CareerCompass AI unifies empirical ML classification with
                actionable skill engineering.
              </p>

              <div className="space-y-4">
                <div className="flex items-start space-x-4 p-4 rounded-2xl bg-slate-800/60 border border-slate-700/70">
                  <div className="w-10 h-10 rounded-xl bg-brand-500/20 text-brand-300 flex items-center justify-center shrink-0">
                    <Lightbulb className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-display text-sm font-bold text-white">Empirical, Not Intuition-Based</h4>
                    <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                      Predictions stem from XGBoost trained across 15,000+ student academic and competency profiles.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 rounded-2xl bg-slate-800/60 border border-slate-700/70">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-display text-sm font-bold text-white">Actionable Execution Plans</h4>
                    <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                      Every predicted role links seamlessly into Skill Gap diagnostics and a 3-stage roadmap.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 rounded-2xl bg-slate-800/60 border border-slate-700/70">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-display text-sm font-bold text-white">Unified Career Ecosystem</h4>
                    <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                      Profile manager, assessment engine, ATS resume scanner, and AI career mentor in one workspace.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Architecture Summary Card */}
            <div className="lg:col-span-6">
              <div className="bg-slate-950/90 rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <p className="text-xs font-semibold text-brand-400 uppercase tracking-wider">
                      Diagnostic Pipeline
                    </p>
                    <h3 className="font-display text-lg font-bold text-white mt-0.5">
                      Real-Time Feature Evaluation
                    </h3>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-brand-500/15 text-brand-300 text-xs font-mono border border-brand-500/30">
                    v2.0 Engine
                  </span>
                </div>

                {[
                  {
                    role: 'Machine Learning Engineer',
                    score: 96.4,
                    reason: 'Strong Python, Scikit-learn, SQL, and CSE academic merit.',
                    barColor: 'bg-gradient-to-r from-brand-500 to-indigo-400',
                    badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
                  },
                  {
                    role: 'Data Scientist',
                    score: 88.2,
                    reason: 'Aligned analytical proficiency and quantitative coursework.',
                    barColor: 'bg-indigo-500',
                    badge: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
                  },
                  {
                    role: 'Backend Developer',
                    score: 81.7,
                    reason: 'Solid database modeling and API software architecture fundamentals.',
                    barColor: 'bg-purple-500',
                    badge: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
                  },
                ].map((row) => (
                  <div key={row.role} className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-display text-sm font-bold text-white">{row.role}</span>
                      <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border ${row.badge} tabular-nums`}>
                        {row.score}% Match
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2 mb-2">
                      <div className={`${row.barColor} h-2 rounded-full`} style={{ width: `${row.score}%` }}></div>
                    </div>
                    <p className="text-xs text-slate-400">{row.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="py-20 bg-gradient-to-r from-brand-700 via-indigo-700 to-brand-800 text-white text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold mb-4 tracking-tight">
            Ready to Map Your Career Trajectory?
          </h2>
          <p className="text-brand-100 text-base sm:text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
            Create your student account in seconds or explore immediately with our pre-configured demo credentials.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-3.5 bg-white text-brand-700 font-bold text-sm rounded-xl hover:bg-slate-50 shadow-xl transition-all hover:-translate-y-0.5"
            >
              Create Free Student Account
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-3.5 bg-white/10 text-white font-semibold text-sm rounded-xl border border-white/25 hover:bg-white/20 transition-all backdrop-blur-sm"
            >
              Try Demo Accounts
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
