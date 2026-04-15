import React, { useState, useEffect, useRef } from 'react';
import { Layout } from '../components/Layout';
import {
  Play, Pause, Square, RotateCcw, FolderDot,
  CheckSquare, ChevronDown, Plus, Trash2, MoreHorizontal, X,
  CalendarDays, TrendingUp, Zap, Timer as TimerIcon, RotateCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── Types ──────────────────────────────────────────────────── */
interface TimeEntry {
  id: number;
  project: string;
  task: string;
  description: string;
  duration: string;   // HH:MM:SS
  date: string;
  startTime: string;
  endTime: string;
  color: string;
}

/* ─── Mock Data ───────────────────────────────────────────────── */
const MOCK_ENTRIES: TimeEntry[] = [
  { id: 1, project: 'Figma Design System', task: 'Component Audit', description: 'Reviewing button variants & tokens', duration: '01:30:00', date: 'Today', startTime: '09:00 AM', endTime: '10:30 AM', color: 'bg-violet-500' },
  { id: 2, project: 'BoostVibe 2.0', task: 'API Integration', description: 'Connecting payment gateway', duration: '02:15:00', date: 'Today', startTime: '11:00 AM', endTime: '01:15 PM', color: 'bg-blue-500' },
  { id: 3, project: 'ProService Desk', task: 'Layout Fixes', description: 'Mobile responsiveness', duration: '01:00:00', date: 'Yesterday', startTime: '03:00 PM', endTime: '04:00 PM', color: 'bg-emerald-500' },
  { id: 4, project: 'Figma Design System', task: 'Dark Mode', description: 'CSS variable mapping', duration: '00:45:00', date: 'Yesterday', startTime: '10:00 AM', endTime: '10:45 AM', color: 'bg-violet-500' },
];

const PROJECTS = ['Figma Design System', 'BoostVibe 2.0', 'ProService Desk', 'Internal Admin'];
const TASKS: Record<string, string[]> = {
  'Figma Design System': ['Component Audit', 'Dark Mode', 'Token Export', 'Documentation'],
  'BoostVibe 2.0': ['API Integration', 'Homepage Hero', 'Onboarding Flow', 'Accessibility'],
  'ProService Desk': ['Layout Fixes', 'Performance Audit', 'Database Review', 'QA Testing'],
  'Internal Admin': ['Dashboard Setup', 'User Management', 'Reports'],
};

const inputCls = "w-full px-4 py-2.5 bg-[#F5F5F5] border border-transparent rounded-[12px] focus:bg-white focus:border-[#1A1A1A] focus:ring-2 focus:ring-black/5 transition-all text-[13px] font-medium text-[#1A1A1A] placeholder:text-[#999999] outline-none";
const selectCls = inputCls + " appearance-none cursor-pointer";

const projectColors: Record<string, string> = {
  'Figma Design System': 'bg-violet-500',
  'BoostVibe 2.0': 'bg-blue-500',
  'ProService Desk': 'bg-emerald-500',
  'Internal Admin': 'bg-amber-500',
};

/* ─── Helpers ─────────────────────────────────────────────────── */
const formatTime = (s: number) => {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
};

const totalSeconds = (dur: string) => {
  const [h, m, s] = dur.split(':').map(Number);
  return h * 3600 + m * 60 + s;
};

const todayTotal = MOCK_ENTRIES.filter(e => e.date === 'Today').reduce((acc, e) => acc + totalSeconds(e.duration), 0);

/* ─── Timer Page ──────────────────────────────────────────────── */
const TimerPage: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [project, setProject] = useState(PROJECTS[0]);
  const [task, setTask] = useState(TASKS[PROJECTS[0]][0]);
  const [description, setDescription] = useState('');
  const [entries, setEntries] = useState<TimeEntry[]>(MOCK_ENTRIES);
  const [showNewEntry, setShowNewEntry] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => setElapsed(p => p + 1), 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning, isPaused]);

  const handleStart = () => { setIsRunning(true); setIsPaused(false); };
  const handlePause = () => setIsPaused(true);
  const handleResume = () => setIsPaused(false);
  const handleStop = () => {
    setIsRunning(false);
    setIsPaused(false);
    const newEntry: TimeEntry = {
      id: Date.now(),
      project, task, description: description || 'No description',
      duration: formatTime(elapsed),
      date: 'Today',
      startTime: new Date(Date.now() - elapsed * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      endTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      color: projectColors[project] || 'bg-slate-500',
    };
    setEntries(prev => [newEntry, ...prev]);
    setElapsed(0);
    setDescription('');
  };
  const handleReset = () => { setIsRunning(false); setIsPaused(false); setElapsed(0); };
  const handleDelete = (id: number) => setEntries(prev => prev.filter(e => e.id !== id));
  const handleContinue = (entry: TimeEntry) => {
    setProject(entry.project);
    setTask(entry.task);
    setDescription(entry.description === 'No description' ? '' : entry.description);
    setElapsed(totalSeconds(entry.duration)); // ← resume from existing time
    setIsRunning(true);
    setIsPaused(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const progress = Math.min((elapsed / 3600) * 100, 100);
  const circumference = 2 * Math.PI * 110;

  return (
    <Layout>
      <div className="space-y-6 pb-8">
        {/* ── Page Header ── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[22px] font-bold text-[#1A1A1A] tracking-tight">Time Tracker</h1>
            <p className="text-[13px] font-medium text-[#999999] mt-0.5">Track your working hours across projects</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white border border-[#F0F0F0] rounded-2xl px-5 py-3 flex items-center gap-3 shadow-sm">
              <div className="w-8 h-8 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center">
                <TrendingUp size={15} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#999999] uppercase tracking-widest">Today</p>
                <p className="text-[15px] font-black text-[#1A1A1A] leading-none">{formatTime(todayTotal)}</p>
              </div>
            </div>
            <div className="bg-white border border-[#F0F0F0] rounded-2xl px-5 py-3 flex items-center gap-3 shadow-sm">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <CalendarDays size={15} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#999999] uppercase tracking-widest">This Week</p>
                <p className="text-[15px] font-black text-[#1A1A1A] leading-none">28h 40m</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Main Content: Timer  +  Log ── */}
        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_380px] gap-6">

          {/* ── Left: Active Timer Card ── */}
          <div className="bg-white rounded-3xl border border-[#F0F0F0] shadow-sm overflow-hidden">
            {/* Card Header bar */}
            <div className="px-8 pt-7 pb-5 border-b border-[#F5F5F5] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`w-2.5 h-2.5 rounded-full ${isRunning && !isPaused ? 'bg-emerald-500 animate-pulse' : 'bg-[#E0E0E0]'}`} />
                <span className="text-[13px] font-bold text-[#1A1A1A]">
                  {!isRunning ? 'Ready to Track' : isPaused ? 'Paused' : 'Tracking Now'}
                </span>
              </div>
              <span className="text-[12px] font-semibold text-[#AAAAAA]">
                {new Date().toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}
              </span>
            </div>

            {/* Clock + Controls */}
            <div className="flex flex-col items-center px-8 py-10">
              {/* Ring Clock */}
              <div className="relative w-64 h-64 mb-10">
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 240 240">
                  <circle cx="120" cy="120" r="110" fill="none" stroke="#F5F5F5" strokeWidth="8" />
                  <motion.circle
                    cx="120" cy="120" r="110"
                    fill="none"
                    stroke={isRunning && !isPaused ? '#1A1A1A' : '#E0E0E0'}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference - (circumference * progress) / 100}
                    transition={{ duration: 0.5 }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[11px] font-bold text-[#BBBBBB] uppercase tracking-[0.2em] mb-1">Elapsed</span>
                  <span className={`text-[3.2rem] font-black font-mono leading-none tracking-tight ${isRunning && !isPaused ? 'text-[#1A1A1A]' : 'text-[#CCCCCC]'}`}>
                    {formatTime(elapsed)}
                  </span>
                </div>
              </div>

              {/* Controls Row */}
              <div className="flex items-center gap-3 mb-10">
                {!isRunning ? (
                  <button
                    onClick={handleStart}
                    className="flex items-center gap-2.5 px-8 py-3.5 bg-[#1A1A1A] text-white rounded-full text-[14px] font-bold hover:bg-black transition-all shadow-lg shadow-black/10 hover:-translate-y-0.5"
                  >
                    <Play size={16} fill="white" /> Start Timer
                  </button>
                ) : (
                  <>
                    <button
                      onClick={isPaused ? handleResume : handlePause}
                      className={`flex items-center gap-2.5 px-7 py-3.5 rounded-full text-[14px] font-bold transition-all hover:-translate-y-0.5 ${
                        isPaused
                          ? 'bg-[#1A1A1A] text-white shadow-lg shadow-black/10'
                          : 'bg-[#F5F5F5] text-[#1A1A1A]'
                      }`}
                    >
                      {isPaused ? <><Play size={15} fill="currentColor" /> Continue</> : <><Pause size={15} /> Pause</>}
                    </button>
                    <button
                      onClick={handleStop}
                      className="flex items-center gap-2.5 px-7 py-3.5 bg-[#FFEBEE] text-[#D32F2F] rounded-full text-[14px] font-bold hover:bg-[#FFCDD2] transition-all hover:-translate-y-0.5"
                    >
                      <Square size={15} fill="#D32F2F" /> Stop
                    </button>
                  </>
                )}
                {elapsed > 0 && (
                  <button onClick={handleReset} className="p-3 rounded-full text-[#BBBBBB] hover:text-[#1A1A1A] hover:bg-[#F5F5F5] transition-all" title="Reset">
                    <RotateCcw size={17} />
                  </button>
                )}
              </div>

              {/* Project / Task / Description form */}
              <div className="w-full max-w-lg space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#AAAAAA] uppercase tracking-wider mb-1.5">Project</label>
                    <div className="relative">
                      <FolderDot size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#AAAAAA] pointer-events-none" />
                      <select
                        className={selectCls + " pl-9 text-[13px]"}
                        value={project}
                        onChange={e => { setProject(e.target.value); setTask(TASKS[e.target.value][0]); }}
                      >
                        {PROJECTS.map(p => <option key={p}>{p}</option>)}
                      </select>
                      <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#AAAAAA] pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#AAAAAA] uppercase tracking-wider mb-1.5">Task</label>
                    <div className="relative">
                      <CheckSquare size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#AAAAAA] pointer-events-none" />
                      <select
                        className={selectCls + " pl-9 text-[13px]"}
                        value={task}
                        onChange={e => setTask(e.target.value)}
                      >
                        {(TASKS[project] || []).map(t => <option key={t}>{t}</option>)}
                      </select>
                      <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#AAAAAA] pointer-events-none" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#AAAAAA] uppercase tracking-wider mb-1.5">What are you working on?</label>
                  <input
                    className={inputCls}
                    placeholder="Add a description..."
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── Right: Today's Breakdown Sidebar ── */}
          <div className="flex flex-col gap-5">
            {/* Mini stats */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Entries Today', value: entries.filter(e => e.date === 'Today').length.toString(), icon: <TimerIcon size={15} />, color: 'bg-violet-100 text-violet-600' },
                { label: 'Avg Per Entry', value: '1h 22m', icon: <Zap size={15} />, color: 'bg-amber-100 text-amber-600' },
              ].map(stat => (
                <div key={stat.label} className="bg-white rounded-2xl border border-[#F0F0F0] p-4 shadow-sm">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>{stat.icon}</div>
                  <p className="text-[18px] font-black text-[#1A1A1A]">{stat.value}</p>
                  <p className="text-[11px] font-bold text-[#AAAAAA] mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Weekly bar chart */}
            <div className="bg-white rounded-3xl border border-[#F0F0F0] p-6 shadow-sm">
              <p className="text-[12px] font-bold text-[#AAAAAA] uppercase tracking-wider mb-4">This Week</p>
              <div className="flex items-end gap-2" style={{ height: 80 }}>
                {[{ d: 'M', h: 6.5 }, { d: 'T', h: 8 }, { d: 'W', h: 7 }, { d: 'T', h: 4.5 }, { d: 'F', h: 3 }, { d: 'S', h: 1.5 }, { d: 'S', h: 0 }].map((item, i) => {
                  const maxH = 8;
                  const barH = Math.max(item.h / maxH * 60, item.h === 0 ? 4 : 6);
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: barH }}
                        transition={{ delay: i * 0.06, duration: 0.5, ease: 'easeOut' }}
                        className={`w-full rounded-t-md ${item.h === 0 ? 'bg-[#EEEEEE]' : 'bg-[#1A1A1A]'}`}
                        style={{ minHeight: 4 }}
                      />
                      <span className="text-[10px] font-bold text-[#BBBBBB]">{item.d}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Project breakdown */}
            <div className="bg-white rounded-3xl border border-[#F0F0F0] p-6 shadow-sm flex-1">
              <p className="text-[12px] font-bold text-[#AAAAAA] uppercase tracking-wider mb-4">By Project</p>
              <div className="space-y-3.5">
                {[
                  { name: 'Figma Design System', hours: 12.5, color: 'bg-violet-500' },
                  { name: 'BoostVibe 2.0', hours: 9, color: 'bg-blue-500' },
                  { name: 'ProService Desk', hours: 7, color: 'bg-emerald-500' },
                ].map(p => (
                  <div key={p.name}>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-[12px] font-semibold text-[#555]">{p.name}</span>
                      <span className="text-[12px] font-bold text-[#1A1A1A]">{p.hours}h</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#F0F0F0] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(p.hours / 28.5) * 100}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className={`h-full rounded-full ${p.color}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Time Log Table ── */}
        <div className="bg-white rounded-3xl border border-[#F0F0F0] shadow-sm overflow-hidden">
          <div className="px-7 py-5 border-b border-[#F5F5F5] flex items-center justify-between">
            <div>
              <h2 className="text-[15px] font-bold text-[#1A1A1A]">Time Log</h2>
              <p className="text-[12px] font-medium text-[#AAAAAA] mt-0.5">{entries.length} entries recorded</p>
            </div>
            <button
              onClick={() => setShowNewEntry(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] text-white rounded-full text-[13px] font-semibold hover:bg-black transition-colors"
            >
              <Plus size={15} /> Add Manual Entry
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#FAFAFA] border-b border-[#F5F5F5]">
                  {['Project', 'Task', 'Description', 'Date', 'Start', 'End', 'Duration', '', ''].map((h, i) => (
                    <th key={i} className="px-6 py-3.5 text-left text-[11px] font-bold text-[#BBBBBB] uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {entries.map((entry, i) => (
                    <motion.tr
                      key={entry.id}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 40 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-[#F8F8F8] hover:bg-[#FAFAFA] transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full shrink-0 ${entry.color}`} />
                          <span className="text-[13px] font-semibold text-[#1A1A1A] whitespace-nowrap">{entry.project}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[13px] font-medium text-[#555555] whitespace-nowrap">{entry.task}</td>
                      <td className="px-6 py-4 text-[13px] text-[#999999] max-w-[200px] truncate">{entry.description}</td>
                      <td className="px-6 py-4 text-[12px] font-semibold text-[#AAAAAA] whitespace-nowrap">{entry.date}</td>
                      <td className="px-6 py-4 text-[12px] font-semibold text-[#1A1A1A] whitespace-nowrap">{entry.startTime}</td>
                      <td className="px-6 py-4 text-[12px] font-semibold text-[#1A1A1A] whitespace-nowrap">{entry.endTime}</td>
                      <td className="px-6 py-4">
                        <span className="text-[13px] font-black text-[#1A1A1A] font-mono">{entry.duration}</span>
                      </td>
                      <td className="px-3 py-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleContinue(entry)}
                          title="Continue this entry"
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-bold text-violet-600 bg-violet-50 hover:bg-violet-100 transition-all whitespace-nowrap"
                        >
                          <RotateCw size={13} /> Continue
                        </button>
                      </td>
                      <td className="px-3 py-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleDelete(entry.id)}
                          title="Delete entry"
                          className="p-1.5 rounded-lg text-[#CCCCCC] hover:text-[#D32F2F] hover:bg-[#FFEBEE] transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Manual Entry Modal */}
      <AnimatePresence>
        {showNewEntry && (
          <ManualEntryModal
            onClose={() => setShowNewEntry(false)}
            onAdd={(entry) => { setEntries(prev => [{ ...entry, id: Date.now() }, ...prev]); setShowNewEntry(false); }}
          />
        )}
      </AnimatePresence>
    </Layout>
  );
};

/* ─── Manual Entry Modal ──────────────────────────────────────── */
const ManualEntryModal = ({ onClose, onAdd }: { onClose: () => void; onAdd: (e: Omit<TimeEntry, 'id'>) => void }) => {
  const [form, setForm] = useState({
    project: PROJECTS[0], task: TASKS[PROJECTS[0]][0],
    description: '', date: 'Today',
    startTime: '09:00 AM', endTime: '10:00 AM', duration: '01:00:00',
    color: projectColors[PROJECTS[0]]
  });
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose}
      />
      <motion.div
        initial={{ scale: 0.94, y: 10, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.94, y: 10, opacity: 0 }}
        className="relative bg-white rounded-[24px] border border-[#EEEEEE] shadow-2xl w-full max-w-lg overflow-hidden"
      >
        <div className="flex items-center justify-between px-7 pt-7 pb-5 border-b border-[#F5F5F5]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[12px] bg-[#1A1A1A] text-white flex items-center justify-center">
              <Plus size={17} />
            </div>
            <div>
              <h2 className="text-[16px] font-bold text-[#1A1A1A]">Manual Entry</h2>
              <p className="text-[12px] font-medium text-[#999999]">Log time manually for any task</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full text-[#999999] hover:text-[#1A1A1A] hover:bg-[#F5F5F5] transition-all">
            <X size={18} />
          </button>
        </div>

        <div className="px-7 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-bold text-[#1A1A1A] mb-2">Project</label>
              <select className={selectCls} value={form.project} onChange={e => { set('project', e.target.value); set('task', TASKS[e.target.value][0]); set('color', projectColors[e.target.value]); }}>
                {PROJECTS.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[12px] font-bold text-[#1A1A1A] mb-2">Task</label>
              <select className={selectCls} value={form.task} onChange={e => set('task', e.target.value)}>
                {(TASKS[form.project] || []).map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-bold text-[#1A1A1A] mb-2">Description</label>
            <input className={inputCls} placeholder="What did you work on?" value={form.description} onChange={e => set('description', e.target.value)} />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[12px] font-bold text-[#1A1A1A] mb-2">Start Time</label>
              <input className={inputCls} placeholder="09:00 AM" value={form.startTime} onChange={e => set('startTime', e.target.value)} />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-[#1A1A1A] mb-2">End Time</label>
              <input className={inputCls} placeholder="10:00 AM" value={form.endTime} onChange={e => set('endTime', e.target.value)} />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-[#1A1A1A] mb-2">Duration</label>
              <input className={inputCls + " font-mono"} placeholder="01:00:00" value={form.duration} onChange={e => set('duration', e.target.value)} />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between px-7 pb-7 pt-2">
          <button onClick={onClose} className="px-5 py-2.5 rounded-full text-[14px] font-semibold text-[#666666] border border-[#EEEEEE] hover:bg-[#F5F5F5] transition-colors">Cancel</button>
          <button
            onClick={() => onAdd(form)}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#1A1A1A] text-white rounded-full text-[14px] font-semibold hover:bg-black transition-colors shadow-sm"
          >
            <Plus size={15} /> Add Entry
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default TimerPage;
