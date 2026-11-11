import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Compass,
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  Shield,
  User,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const user = await login(email, password);
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(from === '/login' ? '/dashboard' : from);
      }
    } catch (err: any) {
      console.error('Login error:', err);
      const detail = err.response?.data?.detail;
      setError(typeof detail === 'string' ? detail : 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  };

  return (
    <div className="min-h-screen flex bg-white font-sans text-slate-900">
      {/* Left Architectural Showcase Panel */}
      <div className="hidden lg:flex lg:w-5/12 bg-slate-950 text-white relative overflow-hidden flex-col justify-between p-10 xl:p-14">
        <div className="absolute inset-0 bg-grid-dark pointer-events-none"></div>
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand-600/25 rounded-full blur-[110px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-600/15 rounded-full blur-[100px] pointer-events-none"></div>

        {/* Brand */}
        <Link to="/" className="relative z-10 flex items-center space-x-3 w-fit group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-brand-600/30">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <span className="font-display text-xl font-extrabold tracking-tight text-white">CareerCompass</span>
            <span className="font-display text-xl font-extrabold text-brand-400 ml-1">AI</span>
          </div>
        </Link>

        {/* Center Pitch */}
        <div className="relative z-10 space-y-6 my-auto">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-500/15 border border-brand-400/25 text-brand-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>89.8% XGBoost Accuracy</span>
          </div>
          <h1 className="font-display text-3xl xl:text-4xl font-extrabold leading-tight tracking-tight">
            Intelligent career clarity built for modern students.
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed max-w-md">
            Access ranked career recommendations, dynamic skill gap diagnostics, ATS resume scoring, and your 24/7 AI career mentor.
          </p>

          <div className="space-y-3 pt-4 border-t border-slate-800/80">
            {[
              '22 specialized career paths classified with explainable logic',
              'Personalized 3-stage roadmaps with curated courses',
              'Instant PDF/DOCX ATS resume keyword benchmarking',
            ].map((item) => (
              <div key={item} className="flex items-center space-x-2.5 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Note */}
        <div className="relative z-10 text-xs text-slate-500">
          © {new Date().getFullYear()} CareerCompass AI • Educational Career Intelligence
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-10 bg-slate-50/40">
        {/* Top Bar */}
        <div className="flex items-center justify-between max-w-md w-full mx-auto">
          <Link
            to="/"
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          <Link to="/" className="lg:hidden flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
              <Compass className="w-4 h-4" />
            </div>
            <span className="font-display font-bold text-sm text-slate-900">CareerCompass AI</span>
          </Link>
        </div>

        {/* Center Form Card */}
        <div className="max-w-md w-full mx-auto my-8 bg-white rounded-2xl border border-slate-200/80 shadow-card p-7 sm:p-8">
          <div className="mb-6">
            <h2 className="font-display text-2xl font-extrabold text-slate-900 tracking-tight">
              Sign in to your account
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Enter your credentials or use a quick demo workspace below.
            </p>
          </div>

          {/* Quick Demo Credentials Bar */}
          <div className="mb-6 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2.5">
              1-Click Demo Credentials
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => fillDemoAccount('student@careercompass.ai', 'Student@123456')}
                className="flex items-center space-x-2 py-2 px-3 rounded-xl bg-white border border-slate-200 hover:border-brand-500 hover:bg-brand-50/40 text-slate-800 text-xs font-semibold shadow-2xs transition-all"
              >
                <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <User className="w-3.5 h-3.5" />
                </div>
                <span className="truncate">Demo Student</span>
              </button>
              <button
                type="button"
                onClick={() => fillDemoAccount('admin@careercompass.ai', 'Admin@123456')}
                className="flex items-center space-x-2 py-2 px-3 rounded-xl bg-white border border-slate-200 hover:border-purple-500 hover:bg-purple-50/40 text-slate-800 text-xs font-semibold shadow-2xs transition-all"
              >
                <div className="w-6 h-6 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <Shield className="w-3.5 h-3.5" />
                </div>
                <span className="truncate">Demo Admin</span>
              </button>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center space-x-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
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

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">Password</label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-brand-600 hover:text-brand-700"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-md shadow-brand-600/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 mt-2"
            >
              {loading ? (
                <span>Signing In...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            New to CareerCompass AI?{' '}
            <Link to="/register" className="font-semibold text-brand-600 hover:text-brand-700">
              Create an account
            </Link>
          </p>
        </div>

        {/* Minimal Footer */}
        <p className="text-center text-xs text-slate-400 max-w-md mx-auto">
          Protected by JWT authentication &amp; encrypted password hashing.
        </p>
      </div>
    </div>
  );
};
