import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Clock,
  MapPin,
  Users,
  X,
  Check,
  ChevronDown,
  Trash2,
  Edit2,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const EventDrawer = ({ event, onClose, onDelete, onEdit, monthName, selectedDate }: any) => {
  return (
    <>
      <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-40" onClick={onClose} />
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed top-0 right-0 h-full w-full max-w-[420px] bg-white z-50 flex flex-col shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-[#F5F5F5] shrink-0">
          <div className="flex-1 pr-4">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-2.5 h-2.5 rounded-full ${event.color}`} />
              <span className={`text-[13px] font-bold uppercase tracking-wider ${event.color.replace('bg-', 'text-')}`}>
                {event.type}
              </span>
            </div>
            <h2 className="text-[19px] font-bold text-[#1A1A1A] leading-tight">{event.title}</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full text-[#999999] hover:text-[#1A1A1A] hover:bg-[#F5F5F5] transition-all">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: <CalendarIcon size={13} className="text-[#999999]" />, label: 'Date', value: `${monthName} ${selectedDate}, 2026` },
              { icon: <Clock size={13} className="text-[#999999]" />, label: 'Time', value: event.time },
              { icon: <MapPin size={13} className="text-[#999999]" />, label: 'Location', value: event.location || 'Not specified' },
              { icon: <Users size={13} className="text-[#999999]" />, label: 'Team', value: '4 Members' },
            ].map(row => (
              <div key={row.label} className="bg-[#F8F8F8] rounded-[18px] p-4">
                <div className="flex items-center gap-2 mb-2">
                  {row.icon}
                  <span className="text-[11px] font-bold text-[#999999] uppercase tracking-wide">{row.label}</span>
                </div>
                <div className="text-[13px] font-bold text-[#1A1A1A]">{row.value}</div>
              </div>
            ))}
          </div>

          <div>
            <p className="text-[12px] font-bold text-[#999999] uppercase tracking-wider mb-2 ml-1">Description</p>
            <div className="bg-[#F8F8F8] rounded-[20px] p-5">
              <p className="text-[14px] font-medium text-[#444444] leading-relaxed">
                {event.description || 'No detailed description provided for this event.'}
              </p>
            </div>
          </div>


        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-[#F5F5F5] p-5 flex items-center gap-3">
          <button
            onClick={onEdit}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-[14px] font-bold text-[#1A1A1A] border border-[#EEEEEE] hover:bg-[#F5F5F5] transition-colors"
          >
            <Edit2 size={16} /> Edit Details
          </button>
          <button
            onClick={onDelete}
            className="p-3 rounded-full text-[#D32F2F] border border-[#FFCDD2] hover:bg-[#FFEBEE] transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </motion.div>
    </>
  );
};

const modalInputCls = "w-full px-4 py-3 bg-[#F5F5F5] border border-transparent rounded-[14px] focus:bg-white focus:border-[#1A1A1A] focus:ring-2 focus:ring-black/5 transition-all text-[14px] font-medium text-[#1A1A1A] placeholder:text-[#999999] outline-none";
const modalSelectCls = modalInputCls + " appearance-none cursor-pointer";

const AddEventModal = ({ onClose, onAdd, selectedDate, monthName }: any) => {
  const [form, setForm] = React.useState({
    title: '',
    time: '10:00 AM',
    type: 'meeting',
    description: '',
    location: ''
  });

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ scale: 0.94, y: 8, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.94, y: 8, opacity: 0 }}
        className="relative bg-white rounded-[24px] border border-[#EEEEEE] shadow-2xl w-full max-w-lg overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#F5F5F5]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[12px] bg-violet-600 flex items-center justify-center text-white">
              <CalendarIcon size={17} />
            </div>
            <div>
              <h2 className="text-[16px] font-bold text-[#1A1A1A]">Add New Event</h2>
              <p className="text-[12px] font-medium text-[#999999]">Scheduling for {monthName} {selectedDate}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full text-[#999999] hover:text-[#1A1A1A] hover:bg-[#F5F5F5] transition-all"><X size={18} /></button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-[13px] font-bold text-[#1A1A1A] mb-2">Event Title <span className="text-rose-500">*</span></label>
            <input
              autoFocus
              className={modalInputCls}
              placeholder="e.g. Weekly Synchronization"
              value={form.title}
              onChange={e => set('title', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-bold text-[#1A1A1A] mb-2">Time</label>
              <div className="relative">
                <input
                  type="time"
                  className={modalInputCls}
                  value={form.time}
                  onChange={e => set('time', e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-[13px] font-bold text-[#1A1A1A] mb-2">Event Type</label>
              <div className="relative">
                <select
                  className={modalSelectCls}
                  value={form.type}
                  onChange={e => set('type', e.target.value)}
                >
                  <option value="meeting">Meeting</option>
                  <option value="task">Task</option>
                  <option value="deadline">Deadline</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999999] pointer-events-none" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-bold text-[#1A1A1A] mb-2">Location / Link</label>
            <div className="relative">
              <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                className={modalInputCls + " pl-11"}
                placeholder="Google Meet or Office Room"
                value={form.location}
                onChange={e => set('location', e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-bold text-[#1A1A1A] mb-2">Description</label>
            <textarea
              rows={3}
              className={modalInputCls + ' resize-none'}
              placeholder="What is this event about?"
              value={form.description}
              onChange={e => set('description', e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center justify-between px-6 pb-6 pt-2">
          <button onClick={onClose} className="px-5 py-2.5 rounded-full text-[14px] font-semibold text-[#666666] border border-[#EEEEEE] bg-white hover:bg-[#F5F5F5] transition-colors">Cancel</button>
          <button
            onClick={() => onAdd(form)}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#1A1A1A] text-white rounded-full text-[14px] font-semibold hover:bg-black transition-colors shadow-sm"
          >
            <Check size={16} /> Create Event
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const AddDailyTaskModal = ({ onClose, onAdd, selectedDate, monthName }: any) => {
  const [title, setTitle] = React.useState('');
  const [priority, setPriority] = React.useState('Medium');

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ scale: 0.94, y: 8, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.94, y: 8, opacity: 0 }}
        className="relative bg-white rounded-[24px] border border-[#EEEEEE] shadow-2xl w-full max-w-md overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#F5F5F5]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[12px] bg-blue-600 flex items-center justify-center text-white">
              <Plus size={17} />
            </div>
            <div>
              <h2 className="text-[16px] font-bold text-[#1A1A1A]">Add Daily Task</h2>
              <p className="text-[12px] font-medium text-[#999999]">Scheduled for {monthName} {selectedDate}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full text-[#999999] hover:text-[#1A1A1A] hover:bg-[#F5F5F5] transition-all"><X size={18} /></button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-[13px] font-bold text-[#1A1A1A] mb-2">Task Title</label>
            <input
              autoFocus
              className={modalInputCls}
              placeholder="e.g. Review codebase"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-[13px] font-bold text-[#1A1A1A] mb-2">Priority</label>
            <div className="flex gap-2">
              {['Low', 'Medium', 'High'].map(p => (
                <button
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border ${priority === p
                    ? 'bg-slate-900 text-white border-transparent shadow-md'
                    : 'bg-slate-50 text-slate-500 border-slate-100 hover:bg-slate-100'
                    }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between px-6 pb-6 pt-2">
          <button onClick={onClose} className="px-5 py-2.5 rounded-full text-[14px] font-semibold text-[#666666] border border-[#EEEEEE] bg-white hover:bg-[#F5F5F5] transition-colors">Cancel</button>
          <button
            onClick={() => onAdd({ title, priority })}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-full text-[14px] font-semibold hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200"
          >
            <Plus size={16} /> Add Task
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const EditEventModal = ({ event, onClose, onSave, selectedDate, monthName }: any) => {
  const [form, setForm] = React.useState({ ...event });
  const set = (k: string, v: string) => setForm((f: any) => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ scale: 0.94, y: 8, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.94, y: 8, opacity: 0 }}
        className="relative bg-white rounded-[24px] border border-[#EEEEEE] shadow-2xl w-full max-w-lg overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#F5F5F5]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[12px] bg-[#1A1A1A] flex items-center justify-center text-white">
              <Edit2 size={17} />
            </div>
            <div>
              <h2 className="text-[16px] font-bold text-[#1A1A1A]">Edit Event</h2>
              <p className="text-[12px] font-medium text-[#999999]">Updates for {monthName} {selectedDate}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full text-[#999999] hover:text-[#1A1A1A] hover:bg-[#F5F5F5] transition-all"><X size={18} /></button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-[13px] font-bold text-[#1A1A1A] mb-2">Event Title <span className="text-rose-500">*</span></label>
            <input
              autoFocus
              className={modalInputCls}
              placeholder="e.g. Weekly Synchronization"
              value={form.title}
              onChange={e => set('title', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-bold text-[#1A1A1A] mb-2">Time</label>
              <div className="relative">
                <input
                  type="time"
                  className={modalInputCls}
                  value={form.time}
                  onChange={e => set('time', e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-[13px] font-bold text-[#1A1A1A] mb-2">Event Type</label>
              <div className="relative">
                <select
                  className={modalSelectCls}
                  value={form.type}
                  onChange={e => set('type', e.target.value)}
                >
                  <option value="meeting">Meeting</option>
                  <option value="task">Task</option>
                  <option value="deadline">Deadline</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999999] pointer-events-none" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-bold text-[#1A1A1A] mb-2">Location / Link</label>
            <div className="relative">
              <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                className={modalInputCls + " pl-11"}
                placeholder="Google Meet or Office Room"
                value={form.location || ''}
                onChange={e => set('location', e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-bold text-[#1A1A1A] mb-2">Description</label>
            <textarea
              rows={3}
              className={modalInputCls + ' resize-none'}
              placeholder="What is this event about?"
              value={form.description}
              onChange={e => set('description', e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center justify-between px-6 pb-6 pt-2">
          <button onClick={onClose} className="px-5 py-2.5 rounded-full text-[14px] font-semibold text-[#666666] border border-[#EEEEEE] bg-white hover:bg-[#F5F5F5] transition-colors">Cancel</button>
          <button
            onClick={() => onSave(form)}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#1A1A1A] text-white rounded-full text-[14px] font-semibold hover:bg-black transition-colors shadow-sm"
          >
            <Check size={16} /> Save Changes
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const DeleteEventModal = ({ event, onClose, onDelete }: any) => {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ scale: 0.94, y: 8, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.94, y: 8, opacity: 0 }}
        className="relative bg-white rounded-[24px] border border-[#EEEEEE] shadow-2xl w-full max-w-sm overflow-hidden p-6"
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 mb-4 animate-bounce">
            <AlertTriangle size={32} />
          </div>
          <h2 className="text-[18px] font-bold text-[#1A1A1A] mb-2">Delete Event?</h2>
          <p className="text-[14px] font-medium text-[#999999] mb-8">
            Are you sure you want to delete <span className="text-[#1A1A1A] font-bold">"{event.title}"</span>? This action cannot be undone.
          </p>

          <div className="grid grid-cols-2 gap-3 w-full">
            <button
              onClick={onClose}
              className="py-3 rounded-xl text-[14px] font-bold text-[#666666] bg-slate-50 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => onDelete(event.id)}
              className="py-3 rounded-xl text-[14px] font-bold text-white bg-rose-500 hover:bg-rose-600 transition-colors shadow-lg shadow-rose-100"
            >
              Delete
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

interface Event {
  id: number;
  title: string;
  time: string;
  type: 'meeting' | 'task' | 'deadline';
  color: string;
  description: string;
}

const MOCK_EVENTS: Record<number, Event[]> = {
  8: [
    { id: 1, title: 'Design Review', time: '10:00 AM', type: 'meeting', color: 'bg-violet-500', description: 'Weekly sync with the design team' },
  ],
  12: [
    { id: 2, title: 'Client Call', time: '02:00 PM', type: 'meeting', color: 'bg-emerald-500', description: 'Project update with Sellora team' },
    { id: 3, title: 'Fix Layout Bug', time: '04:30 PM', type: 'task', color: 'bg-amber-500', description: 'CSS fixes for mobile view' },
  ],
  15: [
    { id: 4, title: 'Project Deadline', time: '11:59 PM', type: 'deadline', color: 'bg-rose-500', description: 'Submit final assets' },
  ],
  20: [
    { id: 5, title: 'Product Demo', time: '01:00 PM', type: 'meeting', color: 'bg-blue-500', description: 'Showcase new prototype' },
  ],
  24: [
    { id: 6, title: 'Sprint Planning', time: '09:00 AM', type: 'meeting', color: 'bg-indigo-500', description: 'Q2 Sprint roadmap planning' },
  ]
};

const CalendarPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 3, 1)); // April 2026 for demo
  const [selectedDate, setSelectedDate] = useState<number | null>(12);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [activeEvent, setActiveEvent] = useState<Event | null>(null);
  const [showEditEvent, setShowEditEvent] = useState(false);
  const [showDeleteEvent, setShowDeleteEvent] = useState(false);

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  const days = [];
  const totalDays = daysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const startDay = firstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());

  // Padding for previous month
  const prevMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
  const prevMonthDaysTotal = prevMonthDate.getDate();
  for (let i = startDay - 1; i >= 0; i--) {
    days.push({ day: prevMonthDaysTotal - i, current: false });
  }

  // Current month days
  for (let i = 1; i <= totalDays; i++) {
    days.push({ day: i, current: true });
  }

  // Padding for next month to fill the grid (6 rows * 7 days = 42)
  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++) {
    days.push({ day: i, current: false });
  }

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Layout>
      <div className="w-full flex flex-col gap-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Calendar</h1>
            <p className="text-sm font-medium text-slate-500 mt-0.5">Manage your schedule and upcoming tasks</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <button
                onClick={prevMonth}
                className="p-2.5 hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-colors"
                title="Previous Month"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="px-4 py-2 font-bold text-slate-700 min-w-[140px] text-center border-x border-slate-100">
                {monthName} {year}
              </div>
              <button
                onClick={nextMonth}
                className="p-2.5 hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-colors"
                title="Next Month"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            <button
              onClick={() => setShowAddEvent(true)}
              className="flex items-center gap-2 px-6 py-2.5 bg-black text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
            >
              <Plus size={18} />
              New Event
            </button>
          </div>
        </div>

        {/* Main Calendar Content */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 min-h-[700px]">
          {/* Left Side: Calendar Grid */}
          <div className="xl:col-span-3 flex flex-col gap-4">
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden">
              {/* Day Headers */}
              <div className="grid grid-cols-7 border-b border-slate-50">
                {dayNames.map(day => (
                  <div key={day} className="py-4 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {day}
                  </div>
                ))}
              </div>

              {/* Grid Cells */}
              <div className="grid grid-cols-7">
                {days.map((d, index) => {
                  const events = d.current ? MOCK_EVENTS[d.day] || [] : [];
                  const isSelected = d.current && selectedDate === d.day;
                  const isToday = d.current && d.day === 15 && currentDate.getMonth() === 3; // Mock today as April 15

                  return (
                    <div
                      key={index}
                      onClick={() => d.current && setSelectedDate(d.day)}
                      className={`min-h-[120px] p-2 border-r border-b border-slate-50 transition-all duration-300 cursor-pointer group relative ${!d.current ? 'bg-slate-50/30' : 'bg-white hover:bg-slate-50/50'
                        } ${index % 7 === 6 ? 'border-r-0' : ''}`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className={`text-sm font-bold flex items-center justify-center w-8 h-8 rounded-full transition-all ${!d.current ? 'text-slate-300' :
                          isToday ? 'bg-blue-600 text-white shadow-md' :
                            isSelected ? 'bg-slate-800 text-white' : 'text-slate-700 group-hover:bg-slate-100'
                          }`}>
                          {d.day}
                        </span>
                        {events.length > 0 && (
                          <div className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse"></div>
                        )}
                      </div>

                      <div className="space-y-1">
                        {events.slice(0, 2).map(event => (
                          <motion.div
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            key={event.id}
                            onClick={(e) => { e.stopPropagation(); setActiveEvent(event); }}
                            className={`${event.color} bg-opacity-10 ${event.color.replace('bg-', 'text-')} px-2 py-1 rounded-lg text-[10px] font-bold truncate border-l-2 ${event.color.replace('bg-', 'border-')} hover:brightness-95 transition-all`}
                          >
                            {event.time} {event.title}
                          </motion.div>
                        ))}
                        {events.length > 2 && (
                          <div className="text-[10px] font-bold text-slate-400 pl-2">
                            +{events.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Side: Day Details & Upcoming */}
          <div className="xl:col-span-1 flex flex-col gap-6">
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl p-6 flex flex-col gap-6 sticky top-6">
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  {selectedDate ? `Events for ${monthName} ${selectedDate}` : 'Select a date'}
                </h3>
                <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">
                  {selectedDate ? (MOCK_EVENTS[selectedDate]?.length || 0) : 0} scheduled events
                </p>
              </div>

              <div className="space-y-4">
                <AnimatePresence mode="wait">
                  {selectedDate && MOCK_EVENTS[selectedDate] ? (
                    MOCK_EVENTS[selectedDate].map(event => (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        key={event.id}
                        onClick={() => setActiveEvent(event)}
                        className="group bg-slate-50 border border-slate-100 rounded-2xl p-4 hover:bg-white hover:shadow-xl hover:border-transparent transition-all duration-300 cursor-pointer"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className={`p-2 rounded-xl bg-white shadow-sm ${event.color.replace('bg-', 'text-')}`}>
                            <Clock size={18} />
                          </div>
                          <button className="p-1 text-slate-300 hover:text-slate-600">
                            <MoreVertical size={16} />
                          </button>
                        </div>
                        <h4 className="font-bold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">{event.title}</h4>
                        <p className="text-xs font-medium text-slate-500 mb-4 leading-relaxed">{event.description}</p>

                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500">
                            <Clock size={12} />
                            {event.time}
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500">
                            <Users size={12} />
                            4 Team Members
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center py-12 text-center"
                    >
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
                        <CalendarIcon size={32} />
                      </div>
                      <p className="text-sm font-bold text-slate-400">No events scheduled for this day</p>
                      <button onClick={() => setShowAddEvent(true)} className="mt-4 text-xs font-bold text-blue-600 hover:underline">Add an event</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {selectedDate && (
                <button
                  onClick={() => setShowAddTask(true)}
                  className="w-full py-3 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl font-bold text-sm transition-colors border border-dashed border-slate-200"
                >
                  + Add task for this day
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showAddEvent && (
          <AddEventModal
            onClose={() => setShowAddEvent(false)}
            onAdd={(data: any) => { console.log(data); setShowAddEvent(false); }}
            selectedDate={selectedDate}
            monthName={monthName}
          />
        )}
        {showAddTask && (
          <AddDailyTaskModal
            onClose={() => setShowAddTask(false)}
            onAdd={(data: any) => { console.log(data); setShowAddTask(false); }}
            selectedDate={selectedDate}
            monthName={monthName}
          />
        )}
        {activeEvent && (
          <EventDrawer
            event={activeEvent}
            onClose={() => setActiveEvent(null)}
            onDelete={() => setShowDeleteEvent(true)}
            onEdit={() => setShowEditEvent(true)}
            selectedDate={selectedDate}
            monthName={monthName}
          />
        )}
        {showEditEvent && activeEvent && (
          <EditEventModal
            event={activeEvent}
            onClose={() => setShowEditEvent(false)}
            onSave={(updated: any) => { console.log('Saved', updated); setShowEditEvent(false); setActiveEvent(updated); }}
            selectedDate={selectedDate}
            monthName={monthName}
          />
        )}
        {showDeleteEvent && activeEvent && (
          <DeleteEventModal
            event={activeEvent}
            onClose={() => setShowDeleteEvent(false)}
            onDelete={(id: any) => { console.log('Deleted', id); setShowDeleteEvent(false); setActiveEvent(null); }}
          />
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default CalendarPage;
