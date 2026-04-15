import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import {
  ChevronLeft, ChevronRight, Download, Check,
  FolderDot, Clock, TrendingUp, CalendarDays,
  CheckCircle2, AlertCircle, ChevronDown, Search,
  FileText, MoreHorizontal, X, Filter
} from 'lucide-react';

/* ─── Types ──────────────────────────────────────────────────── */
interface TimesheetRow {
  id: number;
  project: string;
  task: string;
  color: string;
  hours: Record<string, number>;
  status: 'approved' | 'pending' | 'rejected';
}

/* ─── Data ───────────────────────────────────────────────────── */
const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const WEEK_DATES = ['Apr 13', 'Apr 14', 'Apr 15', 'Apr 16', 'Apr 17', 'Apr 18', 'Apr 19'];

const INITIAL_ROWS: TimesheetRow[] = [
  { id: 1, project: 'Figma Design System', task: 'Component Audit',          color: 'bg-violet-500', hours: { Mon: 2.5, Tue: 3,   Wed: 1.5, Thu: 0,   Fri: 2,   Sat: 0, Sun: 0 }, status: 'approved' },
  { id: 2, project: 'Figma Design System', task: 'Dark Mode Implementation', color: 'bg-violet-500', hours: { Mon: 1,   Tue: 0,   Wed: 2,   Thu: 3,   Fri: 1,   Sat: 0, Sun: 0 }, status: 'approved' },
  { id: 3, project: 'BoostVibe 2.0',       task: 'API Integration',          color: 'bg-blue-500',   hours: { Mon: 0,   Tue: 2,   Wed: 3.5, Thu: 2,   Fri: 1.5, Sat: 0, Sun: 0 }, status: 'pending'  },
  { id: 4, project: 'BoostVibe 2.0',       task: 'Homepage Hero Redesign',   color: 'bg-blue-500',   hours: { Mon: 3,   Tue: 0,   Wed: 0,   Thu: 2.5, Fri: 0,   Sat: 1, Sun: 0 }, status: 'pending'  },
  { id: 5, project: 'ProService Desk',     task: 'Layout Fixes',             color: 'bg-emerald-500',hours: { Mon: 0,   Tue: 1.5, Wed: 0,   Thu: 1,   Fri: 2.5, Sat: 0, Sun: 0 }, status: 'approved' },
  { id: 6, project: 'Internal Admin',      task: 'Dashboard Setup',          color: 'bg-amber-500',  hours: { Mon: 1,   Tue: 1,   Wed: 1,   Thu: 0.5, Fri: 1,   Sat: 0, Sun: 0 }, status: 'rejected' },
];

const PROJECTS = ['All', 'Figma Design System', 'BoostVibe 2.0', 'ProService Desk', 'Internal Admin'];

/* ─── Helpers ────────────────────────────────────────────────── */
const rowTotal = (r: TimesheetRow) => Object.values(r.hours).reduce((s, h) => s + h, 0);
const dayTotal = (day: string, rows: TimesheetRow[]) => rows.reduce((s, r) => s + (r.hours[day] ?? 0), 0);
const weekTotal = (rows: TimesheetRow[]) => rows.reduce((s, r) => s + rowTotal(r), 0);
const fmt = (h: number) => h === 0 ? '—' : `${h}h`;

const getStatusStyle = (s: string) => {
  switch (s) {
    case 'approved': return 'bg-[#E8F5E9] text-[#2E7D32]';
    case 'pending':  return 'bg-[#FFF3E0] text-[#EF6C00]';
    case 'rejected': return 'bg-[#FFEBEE] text-[#D32F2F]';
    default:         return 'bg-[#F5F5F5] text-[#666666]';
  }
};

/* ─── Page ───────────────────────────────────────────────────── */
const TimesheetPage: React.FC = () => {
  const [rows, setRows] = useState<TimesheetRow[]>(INITIAL_ROWS);
  const [weekOffset, setWeekOffset] = useState(0);
  const [filterProject, setFilterProject] = useState('All');
  const [search, setSearch] = useState('');
  const [editingCell, setEditingCell] = useState<{ id: number; day: string } | null>(null);
  const [editValue, setEditValue] = useState('');

  const filtered = rows.filter(r => {
    const byProject = filterProject === 'All' || r.project === filterProject;
    const bySearch   = !search || r.task.toLowerCase().includes(search.toLowerCase()) || r.project.toLowerCase().includes(search.toLowerCase());
    return byProject && bySearch;
  });

  const totalHrs    = weekTotal(filtered);
  const approvedHrs = filtered.filter(r => r.status === 'approved').reduce((s, r) => s + rowTotal(r), 0);
  const pendingHrs  = filtered.filter(r => r.status === 'pending').reduce((s, r) => s + rowTotal(r), 0);

  const startEdit = (id: number, day: string, val: number) => {
    setEditingCell({ id, day });
    setEditValue(val === 0 ? '' : String(val));
  };
  const saveEdit = () => {
    if (!editingCell) return;
    const num = parseFloat(editValue) || 0;
    setRows(prev => prev.map(r => r.id === editingCell.id ? { ...r, hours: { ...r.hours, [editingCell.day]: num } } : r));
    setEditingCell(null);
  };

  return (
    <Layout>
      <div className="space-y-6 pb-10">

        {/* ── Page Header ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-[22px] font-bold text-[#1A1A1A] tracking-tight">Timesheet</h1>
            <p className="text-[13px] text-[#999999] font-medium mt-0.5">Weekly log of hours across all projects</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#EEEEEE] rounded-full text-[13px] font-semibold text-[#555] hover:bg-[#F5F5F5] transition-all shadow-sm">
              <Download size={15} /> Export
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-[#1A1A1A] text-white rounded-full text-[13px] font-semibold hover:bg-black transition-all shadow-sm">
              <Check size={15} /> Submit Today
            </button>
          </div>
        </div>

        {/* ── Summary Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Hours',     value: `${totalHrs}h`,                              sub: 'logged this week',      icon: <Clock size={16} />,        color: 'bg-[#F3E5F5] text-[#7B1FA2]' },
            { label: 'Approved',        value: `${approvedHrs}h`,                           sub: 'confirmed hours',       icon: <CheckCircle2 size={16} />, color: 'bg-[#E8F5E9] text-[#2E7D32]' },
            { label: 'Pending',         value: `${pendingHrs}h`,                            sub: 'awaiting review',       icon: <AlertCircle size={16} />,  color: 'bg-[#FFF3E0] text-[#EF6C00]' },
            { label: 'Goal Progress',   value: `${Math.round((totalHrs / 40) * 100)}%`,     sub: 'of 40h weekly target',  icon: <TrendingUp size={16} />,   color: 'bg-[#E1F5FE] text-[#0288D1]' },
          ].map(c => (
            <div key={c.label} className="bg-white p-5 rounded-[20px] border border-[#EEEEEE] hover:shadow-xl transition-all duration-300">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${c.color}`}>
                {c.icon}
              </div>
              <p className="text-[22px] font-bold text-[#1A1A1A] leading-none">{c.value}</p>
              <p className="text-[13px] font-semibold text-[#1A1A1A] mt-1.5">{c.label}</p>
              <p className="text-[12px] text-[#999999] mt-0.5">{c.sub}</p>
            </div>
          ))}
        </div>

        {/* ── Timesheet Table ── */}
        <div className="bg-white rounded-[20px] border border-[#EEEEEE] overflow-hidden hover:shadow-xl transition-all duration-300">

          {/* Toolbar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 px-6 py-4 border-b border-[#F5F5F5]">
            <div className="flex items-center gap-3">
              {/* Week Navigator */}
              <div className="flex items-center border border-[#EEEEEE] rounded-full overflow-hidden bg-[#F5F5F5]">
                <button onClick={() => setWeekOffset(w => w - 1)} className="p-2 hover:bg-[#EBEBEB] text-[#555] transition-colors">
                  <ChevronLeft size={16} />
                </button>
                <span className="px-4 text-[13px] font-bold text-[#1A1A1A]">
                  {weekOffset === 0 ? 'This Week' : weekOffset === -1 ? 'Last Week' : `${Math.abs(weekOffset)}w ago`}
                </span>
                <button onClick={() => setWeekOffset(w => w + 1)} className="p-2 hover:bg-[#EBEBEB] text-[#555] transition-colors">
                  <ChevronRight size={16} />
                </button>
              </div>
              <span className="text-[12px] text-[#AAAAAA] font-medium">{WEEK_DATES[0]} – {WEEK_DATES[6]}</span>
            </div>

            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#BBBBBB]" />
                <input
                  className="pl-9 pr-8 py-2 bg-[#F5F5F5] border border-transparent rounded-full text-[13px] font-medium text-[#1A1A1A] placeholder:text-[#BBBBBB] outline-none w-44 focus:bg-white focus:border-[#EEEEEE] transition-all"
                  placeholder="Search..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                {search && (
                  <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#BBBBBB] hover:text-[#555]">
                    <X size={12} />
                  </button>
                )}
              </div>

              {/* Project Filter */}
              <div className="relative">
                <FolderDot size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#BBBBBB] pointer-events-none" />
                <select
                  className="pl-8 pr-7 py-2 bg-[#F5F5F5] border border-transparent rounded-full text-[13px] font-semibold text-[#1A1A1A] outline-none appearance-none cursor-pointer focus:bg-white focus:border-[#EEEEEE] transition-all"
                  value={filterProject}
                  onChange={e => setFilterProject(e.target.value)}
                >
                  {PROJECTS.map(p => <option key={p}>{p}</option>)}
                </select>
                <ChevronDown size={11} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#BBBBBB] pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#FAFAFA] border-b border-[#F5F5F5]">
                  <th className="px-6 py-4 text-[11px] font-bold text-[#999999] uppercase tracking-wider min-w-[240px]">Project / Task</th>
                  {WEEK_DAYS.map((d, i) => (
                    <th key={d} className={`px-3 py-4 text-center text-[11px] font-bold text-[#999999] uppercase tracking-wider min-w-[80px] ${d === 'Sat' || d === 'Sun' ? 'bg-[#FAFAFA]' : ''}`}>
                      <div>{d}</div>
                      <div className="text-[10px] normal-case tracking-normal text-[#CCCCCC] font-semibold mt-0.5">{WEEK_DATES[i]}</div>
                    </th>
                  ))}
                  <th className="px-5 py-4 text-center text-[11px] font-bold text-[#999999] uppercase tracking-wider">Total</th>
                  <th className="px-5 py-4 text-center text-[11px] font-bold text-[#999999] uppercase tracking-wider">Status</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((row, idx) => (
                  <tr
                    key={row.id}
                    className="border-b border-[#F5F5F5] hover:bg-[#FAFAFA] transition-colors group"
                    style={{ animationDelay: `${idx * 30}ms` }}
                  >
                    {/* Project / Task */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full shrink-0 ${row.color}`} />
                        <div>
                          <p className="text-[13px] font-bold text-[#1A1A1A]">{row.task}</p>
                          <p className="text-[11px] text-[#999999] font-medium mt-0.5">{row.project}</p>
                        </div>
                      </div>
                    </td>

                    {/* Day cells */}
                    {WEEK_DAYS.map(day => {
                      const val = row.hours[day] ?? 0;
                      const isEditing = editingCell?.id === row.id && editingCell?.day === day;
                      const isWeekend = day === 'Sat' || day === 'Sun';
                      return (
                        <td
                          key={day}
                          className={`px-2 py-3 text-center ${isWeekend ? 'bg-[#FAFAFA]' : ''}`}
                          onClick={() => startEdit(row.id, day, val)}
                        >
                          {isEditing ? (
                            <input
                              autoFocus
                              className="w-16 text-center text-[13px] font-bold bg-white border border-[#1A1A1A] rounded-xl py-1.5 outline-none"
                              value={editValue}
                              onChange={e => setEditValue(e.target.value)}
                              onBlur={saveEdit}
                              onKeyDown={e => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') setEditingCell(null); }}
                            />
                          ) : (
                            <span className={`inline-flex items-center justify-center w-14 h-8 rounded-xl text-[13px] font-bold cursor-text transition-all
                              ${val > 0 ? 'bg-[#F5F5F5] text-[#1A1A1A] hover:bg-[#EEEEEE]' : 'text-[#DDDDDD] hover:bg-[#F5F5F5] hover:text-[#AAAAAA]'}`}>
                              {fmt(val)}
                            </span>
                          )}
                        </td>
                      );
                    })}

                    {/* Row Total */}
                    <td className="px-5 py-4 text-center">
                      <span className="text-[14px] font-bold text-[#1A1A1A]">{rowTotal(row)}h</span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-[12px] font-semibold capitalize ${getStatusStyle(row.status)}`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>

              {/* Footer: Totals */}
              <tfoot>
                <tr className="border-t-2 border-[#F0F0F0] bg-[#FAFAFA]">
                  <td className="px-6 py-4 text-[12px] font-bold text-[#999999] uppercase tracking-wider">Daily Total</td>
                  {WEEK_DAYS.map(day => {
                    const total = dayTotal(day, filtered);
                    const isWeekend = day === 'Sat' || day === 'Sun';
                    return (
                      <td key={day} className={`px-2 py-4 text-center ${isWeekend ? 'bg-[#F5F5F5]' : ''}`}>
                        <span className={`text-[14px] font-bold ${total >= 8 ? 'text-[#2E7D32]' : total >= 4 ? 'text-[#1A1A1A]' : 'text-[#CCCCCC]'}`}>
                          {total > 0 ? `${total}h` : '—'}
                        </span>
                      </td>
                    );
                  })}
                  <td className="px-5 py-4 text-center">
                    <span className="text-[16px] font-bold text-[#1A1A1A]">{weekTotal(filtered)}h</span>
                  </td>
                  <td />
                </tr>

                {/* Capacity mini-bars */}
                <tr className="border-t border-[#F0F0F0]">
                  <td className="px-6 py-3 text-[11px] font-bold text-[#CCCCCC] uppercase tracking-wider">Capacity</td>
                  {WEEK_DAYS.map(day => {
                    const pct = Math.min((dayTotal(day, filtered) / 8) * 100, 100);
                    const isWeekend = day === 'Sat' || day === 'Sun';
                    return (
                      <td key={day} className={`px-4 py-3 ${isWeekend ? 'bg-[#F5F5F5]' : ''}`}>
                        <div className="w-full h-1.5 bg-[#F0F0F0] rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${pct >= 100 ? 'bg-[#2E7D32]' : pct >= 50 ? 'bg-[#1A1A1A]' : 'bg-[#CCCCCC]'}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </td>
                    );
                  })}
                  <td colSpan={2} />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* ── Project Breakdown Cards ── */}
        <div>
          <h2 className="text-[15px] font-bold text-[#1A1A1A] mb-4">Project Breakdown</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { project: 'Figma Design System', color: 'bg-violet-500', hours: 14.5, target: 20, status: 'approved', tasks: 2 },
              { project: 'BoostVibe 2.0',       color: 'bg-blue-500',   hours: 14,   target: 20, status: 'pending',  tasks: 2 },
              { project: 'ProService Desk',      color: 'bg-emerald-500',hours: 5,    target: 10, status: 'approved', tasks: 1 },
            ].map(p => (
              <div key={p.project} className="bg-white p-5 rounded-[20px] border border-[#EEEEEE] hover:shadow-xl transition-all duration-300 cursor-pointer">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-3 h-3 rounded-full ${p.color}`} />
                    <div>
                      <p className="text-[14px] font-bold text-[#1A1A1A]">{p.project}</p>
                      <p className="text-[12px] text-[#999999]">{p.tasks} tasks logged</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[12px] font-semibold capitalize ${getStatusStyle(p.status)}`}>
                    {p.status}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex-1 bg-[#F5F5F5] rounded-full h-[6px]">
                    <div
                      className="bg-[#1A1A1A] h-full rounded-full transition-all duration-700"
                      style={{ width: `${Math.min((p.hours / p.target) * 100, 100)}%` }}
                    />
                  </div>
                  <span className="text-[13px] font-bold text-[#1A1A1A] shrink-0">{Math.round((p.hours / p.target) * 100)}%</span>
                </div>

                {/* Stats row */}
                <div className="flex items-center justify-between pt-3 border-t border-[#F5F5F5]">
                  <div>
                    <p className="text-[12px] text-[#999999]">Logged</p>
                    <p className="text-[16px] font-bold text-[#1A1A1A]">{p.hours}h</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[12px] text-[#999999]">Target</p>
                    <p className="text-[16px] font-bold text-[#1A1A1A]">{p.target}h</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </Layout>
  );
};

export default TimesheetPage;
