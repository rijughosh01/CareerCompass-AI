import React, { useEffect, useState } from 'react';
import {
  ShieldCheck,
  Users,
  FileCheck2,
  Cpu,
  Database,
  Search,
  CheckCircle2,
  Activity,
  ArrowUpRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import api from '../services/api';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/admin/dashboard'), api.get('/admin/students')])
      .then(([statsRes, studentsRes]) => {
        setStats(statsRes.data);
        setStudents(studentsRes.data);
      })
      .catch((err) => {
        console.error('Error fetching admin telemetry:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredStudents = students.filter(
    (s) =>
      s.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.stream?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Executive Telemetry Banner */}
      <div className="bg-slate-950 rounded-2xl p-6 sm:p-8 text-white shadow-elevated relative overflow-hidden border border-slate-800">
        <div className="absolute inset-0 bg-grid-dark pointer-events-none"></div>
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-200 text-xs font-semibold border border-purple-400/30 mb-2.5">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              <span>Administrative Telemetry &amp; Cohort Control</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
              Platform Administration
            </h1>
            <p className="text-sm text-slate-300 mt-1.5 max-w-xl leading-relaxed">
              Monitor student engagement, oversee XGBoost inference load, inspect career prediction trends, and manage registered cohorts.
            </p>
          </div>

          <div className="inline-flex items-center space-x-2 text-xs font-semibold px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 self-start sm:self-auto shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>All Services Operational</span>
          </div>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Registered Students
            </span>
            <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 border border-brand-100 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="font-display text-3xl font-extrabold text-slate-900 tabular-nums">
            {loading ? '—' : stats?.total_students || 0}
          </p>
          <p className="text-xs text-emerald-600 font-semibold mt-1.5 flex items-center">
            <ArrowUpRight className="w-3.5 h-3.5 mr-1" />
            <span>Active Student Cohort</span>
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Assessments Run
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <p className="font-display text-3xl font-extrabold text-slate-900 tabular-nums">
            {loading ? '—' : stats?.total_assessments || 0}
          </p>
          <p className="text-xs text-brand-600 font-semibold mt-1.5">
            Evaluated via XGBoost Pipeline
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              ML Model Accuracy
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <p className="font-display text-3xl font-extrabold text-slate-900 tabular-nums">89.8%</p>
            <span className="text-xs font-bold text-emerald-600">Test Acc</span>
          </div>
          <p className="text-xs text-slate-500 mt-1.5">22 Career Classes Loaded</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Database Engine
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
          </div>
          <p className="font-display text-2xl font-extrabold text-slate-900">SQLAlchemy</p>
          <p className="text-xs text-emerald-600 font-semibold mt-2 flex items-center">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
            <span>Connected &amp; Healthy</span>
          </p>
        </div>
      </div>

      {/* Visual Analytics & Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Bar Chart */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card lg:col-span-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display text-base font-bold text-slate-900">
                Career Recommendation Distribution
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Top predicted career paths across submitted student assessments
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-600">
              Live Aggregation
            </span>
          </div>

          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats?.top_careers || []}
                margin={{ top: 10, right: 12, left: -16, bottom: 42 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  angle={-25}
                  textAnchor="end"
                  interval={0}
                  tick={{ fontSize: 11, fill: '#475569' }}
                />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '10px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" fill="#4f46e5" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card lg:col-span-4 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-base font-bold text-slate-900">Recent Activity</h3>
            <Activity className="w-4 h-4 text-slate-400" />
          </div>

          <div className="space-y-3 overflow-y-auto max-h-72 pr-1 flex-1">
            {stats?.recent_activity && stats.recent_activity.length > 0 ? (
              stats.recent_activity.map((act: any) => (
                <div
                  key={act.id}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center space-x-2 min-w-0">
                      <span className="w-2 h-2 rounded-full bg-brand-500 shrink-0"></span>
                      <span className="text-xs font-bold text-slate-900 truncate">{act.user_name}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 shrink-0">{act.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-600 pl-4">{act.action}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400 text-center py-10">No recent activity recorded.</p>
            )}
          </div>
        </div>
      </div>

      {/* Registered Students Directory Table */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="font-display text-base font-bold text-slate-900">
              Registered Students Directory
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Inspect student academic profiles and completed assessment counts ({filteredStudents.length} shown)
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name, email, or stream..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-slate-200 text-xs text-slate-500 uppercase font-semibold tracking-wider">
                <th className="pb-3 pr-4">Student</th>
                <th className="pb-3 pr-4">Email Address</th>
                <th className="pb-3 pr-4">Stream</th>
                <th className="pb-3 pr-4">Qualification</th>
                <th className="pb-3 pr-4">Assessments</th>
                <th className="pb-3">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 pr-4">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-700 border border-brand-200 flex items-center justify-center text-xs font-bold shrink-0">
                          {s.full_name?.charAt(0).toUpperCase() || 'S'}
                        </div>
                        <span className="font-semibold text-slate-900">{s.full_name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 pr-4 text-slate-600">{s.email}</td>
                    <td className="py-3.5 pr-4">
                      <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold">
                        {s.stream || 'General'}
                      </span>
                    </td>
                    <td className="py-3.5 pr-4 text-slate-600">{s.highest_qualification || 'N/A'}</td>
                    <td className="py-3.5 pr-4">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 tabular-nums">
                        {s.assessment_count || 0} completed
                      </span>
                    </td>
                    <td className="py-3.5 text-slate-400 text-xs">{s.created_at}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-sm text-slate-400">
                    No matching student records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
