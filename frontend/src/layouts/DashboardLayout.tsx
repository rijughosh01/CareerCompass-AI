import React, { useState } from 'react';
import { Outlet, useLocation, Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  ChevronRight,
  Sparkles,
  Bot,
  User as UserIcon,
  LogOut,
  Shield,
  LayoutDashboard,
  ChevronDown,
} from 'lucide-react';
import { Sidebar } from '../components/common/Sidebar';
import { useAuth } from '../context/AuthContext';

const ROUTE_TITLES: Record<string, { section: string; title: string }> = {
  '/dashboard': { section: 'Overview', title: 'Student Dashboard' },
  '/profile': { section: 'Overview', title: 'My Academic Profile' },
  '/assessment': { section: 'Career Intelligence', title: 'Career Assessment' },
  '/predictions': { section: 'Career Intelligence', title: 'Career Predictions' },
  '/skill-gap': { section: 'Career Intelligence', title: 'Skill Gap Analysis' },
  '/roadmap': { section: 'Growth & AI Tools', title: 'Learning Roadmap' },
  '/resume': { section: 'Growth & AI Tools', title: 'ATS Resume Analyzer' },
  '/chat': { section: 'Growth & AI Tools', title: 'AI Career Counselor' },
  '/admin': { section: 'Administration', title: 'Admin Analytics' },
};

export const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const meta = ROUTE_TITLES[location.pathname] || {
    section: 'Workspace',
    title: 'CareerCompass AI',
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      {/* Persistent Desktop Sidebar + Mobile Drawer */}
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      {/* Right Main Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Clean Contextual Top App Bar */}
        <header className="h-16 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 sticky top-0 z-20 px-4 sm:px-6 lg:px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3 min-w-0">
            {/* Mobile Menu Trigger */}
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              aria-label="Open Navigation"
              className="lg:hidden p-2 -ml-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb Context */}
            <nav aria-label="Breadcrumb" className="flex items-center space-x-1.5 text-sm truncate">
              <span className="text-slate-400 font-medium hidden sm:inline">{meta.section}</span>
              <ChevronRight className="w-4 h-4 text-slate-300 hidden sm:inline shrink-0" />
              <h1 className="font-display font-bold text-slate-900 truncate text-sm sm:text-base">
                {meta.title}
              </h1>
            </nav>
          </div>

          {/* Right Quick Utilities */}
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            {location.pathname !== '/chat' && user?.role === 'student' && (
              <Link
                to="/chat"
                className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 border border-slate-200/80 transition-colors"
              >
                <Bot className="w-3.5 h-3.5 text-brand-600" />
                <span>Ask AI</span>
              </Link>
            )}

            {location.pathname !== '/assessment' && user?.role === 'student' && (
              <Link
                to="/assessment"
                className="hidden md:inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 shadow-xs transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>New Assessment</span>
              </Link>
            )}

            {/* User Profile Pill */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 pl-1.5 pr-2.5 py-1 rounded-full border border-slate-200 bg-white hover:bg-slate-50 transition-colors shadow-2xs"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                  {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="text-xs font-semibold text-slate-800 max-w-[100px] truncate hidden sm:inline">
                  {user?.full_name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {dropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-elevated border border-slate-200/80 py-2 z-50 animate-fade-up"
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-medium text-slate-400">Account</span>
                      <span
                        className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-md ${
                          user?.role === 'admin'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {user?.role}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-900 truncate mt-0.5">{user?.email}</p>
                  </div>

                  <div className="py-1">
                    {user?.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-brand-600"
                      >
                        <Shield className="w-3.5 h-3.5 mr-2.5 text-purple-600" />
                        Admin Analytics
                      </Link>
                    )}
                    <Link
                      to="/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-brand-600"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 mr-2.5 text-slate-400" />
                      Student Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-brand-600"
                    >
                      <UserIcon className="w-3.5 h-3.5 mr-2.5 text-slate-400" />
                      Profile Settings
                    </Link>
                  </div>

                  <div className="border-t border-slate-100 my-1"></div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full text-left flex items-center px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                  >
                    <LogOut className="w-3.5 h-3.5 mr-2.5" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Workspace Canvas */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
