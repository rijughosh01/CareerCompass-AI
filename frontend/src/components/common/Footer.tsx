import React from 'react';
import { Compass, ShieldCheck, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 text-slate-400">
      {/* Top Banner: Ethical AI Disclosure */}
      <div className="bg-slate-900/70 border-b border-slate-800/80 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-start sm:items-center space-x-3">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
          <p className="text-xs leading-relaxed text-slate-400">
            <strong className="text-slate-200 font-semibold">Ethical AI &amp; Predictive Disclaimer:</strong> CareerCompass AI
            predictions and affinity scores are probabilistic machine-learning estimates based on academic and skill
            patterns. They are designed strictly for educational exploration and guidance and do not constitute
            guarantees of employment or placement outcomes.
          </p>
        </div>
      </div>

      {/* Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-12 gap-10">
        {/* Brand Col */}
        <div className="space-y-4 md:col-span-5">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-600/20">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <span className="font-display text-lg font-extrabold text-white tracking-tight">CareerCompass</span>
              <span className="font-display text-lg font-extrabold text-brand-400 ml-1">AI</span>
            </div>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
            Empowering students with data-driven career matching, dynamic skill gap analysis, structured learning
            roadmaps, and transparent AI explainability.
          </p>
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-medium text-emerald-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Trained on 15,000+ Student Profiles (89.8% Test Accuracy)</span>
          </div>
        </div>

        {/* Platform Links */}
        <div className="md:col-span-2">
          <h4 className="font-display text-xs font-bold text-white uppercase tracking-wider mb-4">
            Modules
          </h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/assessment" className="hover:text-white transition-colors">Career Assessment</Link></li>
            <li><Link to="/predictions" className="hover:text-white transition-colors">Predictions</Link></li>
            <li><Link to="/skill-gap" className="hover:text-white transition-colors">Skill Gap</Link></li>
            <li><Link to="/roadmap" className="hover:text-white transition-colors">Roadmaps</Link></li>
            <li><Link to="/resume" className="hover:text-white transition-colors">Resume Scanner</Link></li>
          </ul>
        </div>

        {/* Technology */}
        <div className="md:col-span-3">
          <h4 className="font-display text-xs font-bold text-white uppercase tracking-wider mb-4">
            AI Architecture
          </h4>
          <ul className="space-y-2.5 text-sm text-slate-400">
            <li>22-Class XGBoost Classifier</li>
            <li>Skill Vectorization &amp; Scoring</li>
            <li>Transparent Model Rationales</li>
            <li>FastAPI &amp; PostgreSQL Backend</li>
            <li><Link to="/chat" className="text-brand-400 hover:text-brand-300 transition-colors">AI Career Counselor</Link></li>
          </ul>
        </div>

        {/* Access */}
        <div className="md:col-span-2">
          <h4 className="font-display text-xs font-bold text-white uppercase tracking-wider mb-4">
            Account
          </h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/login" className="hover:text-white transition-colors">Sign In</Link></li>
            <li><Link to="/register" className="hover:text-white transition-colors">Register Free</Link></li>
            <li><Link to="/forgot-password" className="hover:text-white transition-colors">Reset Password</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
        <p>© {new Date().getFullYear()} CareerCompass AI. All rights reserved.</p>
        <p className="mt-2 sm:mt-0">
          Built for student career clarity &amp; academic readiness.
        </p>
      </div>
    </footer>
  );
};
