import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Compass, Mail, ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex bg-white font-sans text-slate-900">
      {/* Left Architectural Panel */}
      <div className="hidden lg:flex lg:w-5/12 bg-slate-950 text-white relative overflow-hidden flex-col justify-between p-10 xl:p-14">
        <div className="absolute inset-0 bg-grid-dark pointer-events-none"></div>
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand-600/20 rounded-full blur-[110px] pointer-events-none"></div>

        <Link to="/" className="relative z-10 flex items-center space-x-3 w-fit">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-brand-600/30">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <span className="font-display text-xl font-extrabold tracking-tight text-white">CareerCompass</span>
            <span className="font-display text-xl font-extrabold text-brand-400 ml-1">AI</span>
          </div>
        </Link>

        <div className="relative z-10 space-y-5 my-auto">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-500/15 border border-brand-400/25 text-brand-300 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Account Security</span>
          </div>
          <h1 className="font-display text-3xl font-extrabold leading-tight tracking-tight">
            Recover secure access to your CareerCompass workspace.
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed max-w-md">
            Your saved career assessments, skill benchmarks, and resume scans remain safely stored in our encrypted database.
          </p>
        </div>

        <div className="relative z-10 text-xs text-slate-500">
          © {new Date().getFullYear()} CareerCompass AI
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-10 bg-slate-50/40">
        <div className="flex items-center justify-between max-w-md w-full mx-auto">
          <Link
            to="/login"
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Sign In</span>
          </Link>

          <Link to="/" className="lg:hidden flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
              <Compass className="w-4 h-4" />
            </div>
            <span className="font-display font-bold text-sm text-slate-900">CareerCompass AI</span>
          </Link>
        </div>

        <div className="max-w-md w-full mx-auto my-auto bg-white rounded-2xl border border-slate-200/80 shadow-card p-7 sm:p-8">
          <div className="mb-6">
            <h2 className="font-display text-2xl font-extrabold text-slate-900 tracking-tight">
              Reset Password
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Enter your registered email address to receive recovery instructions.
            </p>
          </div>

          {submitted ? (
            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
              <CheckCircle2 className="w-9 h-9 text-emerald-600 mx-auto" />
              <h3 className="font-display text-base font-bold text-emerald-950">Recovery Instructions Sent</h3>
              <p className="text-sm text-emerald-800 leading-relaxed">
                If an account exists for <strong className="font-semibold">{email}</strong>, you will receive an
                email shortly with a secure reset link.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center space-x-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700 pt-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Sign In</span>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@careercompass.ai"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-md shadow-brand-600/20 transition-all"
              >
                Send Reset Link
              </button>
            </form>
          )}
        </div>

        <div></div>
      </div>
    </div>
  );
};
