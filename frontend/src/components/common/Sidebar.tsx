import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  FileCheck2,
  TrendingUp,
  GitCompare,
  Milestone,
  FileText,
  Bot,
  ShieldCheck,
  LogOut,
  Compass,
  Cpu,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

interface NavGroup {
  label: string;
  items: {
    name: string;
    path: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }[];
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen = false, onClose }) => {
  const { user, logout } = useAuth();

  const navGroups: NavGroup[] = [
    ...(user?.role === 'admin'
      ? [
          {
            label: 'Administration',
            items: [
              { name: 'Admin Analytics', path: '/admin', icon: ShieldCheck, badge: 'Admin' },
            ],
          },
        ]
      : []),
    {
      label: 'Overview',
      items: [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'My Profile', path: '/profile', icon: User },
      ],
    },
    {
      label: 'Career Intelligence',
      items: [
        { name: 'Career Assessment', path: '/assessment', icon: FileCheck2 },
        { name: 'Career Predictions', path: '/predictions', icon: TrendingUp },
        { name: 'Skill Gap Analysis', path: '/skill-gap', icon: GitCompare },
      ],
    },
    {
      label: 'Growth & AI Tools',
      items: [
        { name: 'Learning Roadmap', path: '/roadmap', icon: Milestone },
        { name: 'Resume Analyzer', path: '/resume', icon: FileText },
        { name: 'AI Counselor', path: '/chat', icon: Bot, badge: 'AI' },
      ],
    },
  ];

  const sidebarContent = (
    <div className="w-64 h-full bg-slate-950 border-r border-slate-800/80 flex flex-col justify-between text-slate-300 select-none">
      {/* Top Brand Header inside Sidebar */}
      <div className="h-16 px-5 flex items-center justify-between border-b border-slate-800/80 shrink-0">
        <Link to="/" onClick={onClose} className="flex items-center space-x-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-600/30">
            <Compass className="w-4 h-4" />
          </div>
          <div className="leading-none">
            <span className="font-display text-base font-extrabold text-white tracking-tight">
              CareerCompass
            </span>
            <span className="font-display text-base font-extrabold text-brand-400 ml-0.5">AI</span>
          </div>
        </Link>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Sidebar"
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Scrollable Navigation Groups */}
      <div className="flex-1 px-3 py-4 overflow-y-auto space-y-6">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
              {group.label}
            </p>
            <div className="space-y-1">
              {group.items.map((link) => {
                const Icon = link.icon;
                return (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `group relative flex items-center justify-between px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all ${
                        isActive
                          ? 'bg-brand-600/15 text-white border border-brand-500/30 font-semibold shadow-xs'
                          : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900 border border-transparent'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div className="flex items-center space-x-3">
                          {isActive && (
                            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-brand-400 rounded-r-full" />
                          )}
                          <Icon
                            className={`w-4 h-4 shrink-0 transition-colors ${
                              isActive ? 'text-brand-400' : 'text-slate-500 group-hover:text-slate-300'
                            }`}
                          />
                          <span>{link.name}</span>
                        </div>
                        {link.badge && (
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                              link.badge === 'Admin'
                                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                : 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                            }`}
                          >
                            {link.badge}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom ML Status + User Card */}
      <div className="p-3 border-t border-slate-800/80 space-y-3 bg-slate-950">
        {/* Compact Engine Status Pill */}
        <div className="px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px] font-medium text-slate-300">XGBoost 22-Class</span>
          </div>
          <span className="inline-flex items-center text-[10px] font-semibold text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 animate-pulse"></span>
            Live
          </span>
        </div>

        {/* User Footer */}
        <div className="flex items-center justify-between px-2 py-1.5 rounded-xl hover:bg-slate-900/70 transition-colors">
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm">
              {user?.full_name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user?.full_name || 'User'}</p>
              <div className="flex items-center space-x-1.5 mt-0.5">
                <span
                  className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded ${
                    user?.role === 'admin'
                      ? 'bg-purple-500/20 text-purple-300'
                      : 'bg-emerald-500/20 text-emerald-300'
                  }`}
                >
                  {user?.role}
                </span>
                <span className="text-[10px] text-slate-500 truncate">{user?.email}</span>
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            title="Sign Out"
            aria-label="Sign Out"
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Static Sidebar */}
      <aside className="hidden lg:block shrink-0 h-screen sticky top-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Slide-Over Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
            onClick={onClose}
          />
          <div className="relative z-10 flex h-full shadow-2xl animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
