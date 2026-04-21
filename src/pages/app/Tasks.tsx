import { useState, useEffect } from 'react';
import { Layout } from '../../components/layout/Layout';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Search, ChevronDown, MoreHorizontal,
  Calendar, MessageSquare, CheckCircle2, Circle,
  Clock, AlertCircle, ChevronUp, SlidersHorizontal,
  X, Flag, FolderDot, Tag, Edit2, Trash2, ExternalLink, Check
} from 'lucide-react';
import type { JiraTask } from '../../types/jira';
import { JIRA_STORAGE_KEYS } from '../../types/jira';

/* ─── Types ──────────────────────────────────────────────────── */
interface Task {
  id: string | number;
  title: string;
  project: string;
  projectId: string;
  tag: string;
  status: string;
  priority: string;
  due: string;
  comments: number;
  description?: string;
}

/* ─── Mock Data ──────────────────────────────────────────────── */
const ALL_TASKS: Task[] = [
  { id: 1, title: 'Design System Update', project: 'Figma Design System', projectId: '1', tag: 'Design', status: 'In Progress', priority: 'High', due: 'Nov 08, 2026', comments: 3, description: 'Update the design system with the latest tokens, typography scale, and component variants. Ensure all components are responsive and accessible.' },
  { id: 2, title: 'User Research Synthesis', project: 'Figma Design System', projectId: '1', tag: 'Research', status: 'To Do', priority: 'Medium', due: 'Nov 09, 2026', comments: 1, description: 'Synthesize findings from 12 user interviews into actionable insights. Create affinity map and document key pain points.' },
  { id: 3, title: 'Homepage Hero Redesign', project: 'BoostVibe 2.0', projectId: '2', tag: 'UI', status: 'In Review', priority: 'High', due: 'Nov 10, 2026', comments: 5, description: 'Redesign the homepage hero section with new visuals, updated CTA copy, and improved layout for mobile and desktop.' },
  { id: 4, title: 'Responsive Testing', project: 'ProService Desk', projectId: '3', tag: 'QA', status: 'To Do', priority: 'Low', due: 'Nov 12, 2026', comments: 0, description: 'Test all major pages across breakpoints (320px, 768px, 1024px, 1440px). Document and report any layout issues found.' },
  { id: 5, title: 'Performance Audit', project: 'ProService Desk', projectId: '3', tag: 'Dev', status: 'Completed', priority: 'High', due: 'Nov 14, 2026', comments: 2, description: 'Run Lighthouse audit on all core pages. Fix LCP, CLS, and FID issues. Target score of 90+ on all metrics.' },
  { id: 6, title: 'API Integration', project: 'BoostVibe 2.0', projectId: '2', tag: 'Dev', status: 'In Progress', priority: 'High', due: 'Nov 15, 2026', comments: 4, description: 'Integrate third-party payment gateway API. Implement error handling, retry logic, and webhook listeners.' },
  { id: 7, title: 'Write Release Notes', project: 'ProService Desk', projectId: '3', tag: 'Research', status: 'To Do', priority: 'Low', due: 'Nov 18, 2026', comments: 0, description: 'Write comprehensive release notes for v2.4. Cover new features, bug fixes, and deprecations.' },
  { id: 8, title: 'Dark Mode Implementation', project: 'Figma Design System', projectId: '1', tag: 'UI', status: 'In Progress', priority: 'Medium', due: 'Nov 20, 2026', comments: 6, description: 'Implement system-wide dark mode using CSS custom properties. Ensure all components support both themes.' },
  { id: 9, title: 'Accessibility Audit', project: 'BoostVibe 2.0', projectId: '2', tag: 'QA', status: 'To Do', priority: 'Medium', due: 'Nov 22, 2026', comments: 1, description: 'Conduct full WCAG 2.1 AA accessibility audit. Fix all critical and high severity issues before launch.' },
  { id: 10, title: 'Brand Asset Export', project: 'Figma Design System', projectId: '1', tag: 'Design', status: 'Completed', priority: 'Low', due: 'Nov 25, 2026', comments: 2, description: 'Export all brand assets in SVG, PNG (1x, 2x, 3x), and WebP formats. Organise into the shared drive.' },
  { id: 11, title: 'Onboarding Flow Redesign', project: 'BoostVibe 2.0', projectId: '2', tag: 'UI', status: 'In Review', priority: 'High', due: 'Nov 28, 2026', comments: 3, description: 'Redesign the user onboarding flow to reduce drop-off. Simplify steps and add inline guidance tooltips.' },
  { id: 12, title: 'Database Schema Review', project: 'ProService Desk', projectId: '3', tag: 'Dev', status: 'Completed', priority: 'Medium', due: 'Nov 30, 2026', comments: 0, description: 'Review current database schema for normalisation issues. Propose optimised schema and migration plan.' },
];

const readJson = <T,>(key: string, fallback: T): T => {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

const mapJiraPriority = (priority: string) => {
  if (/highest|high|blocker|critical/i.test(priority)) return 'High';
  if (/lowest|low|minor/i.test(priority)) return 'Low';
  return 'Medium';
};

const mapJiraStatus = (status: string) => {
  if (/done|complete|closed|resolved/i.test(status)) return 'Completed';
  if (/review|qa|verify/i.test(status)) return 'In Review';
  if (/progress|doing|development/i.test(status)) return 'In Progress';
  return 'To Do';
};

const mapJiraTasks = (tasks: JiraTask[]): Task[] => {
  return tasks.map(task => ({
    id: `jira-${task.id}`,
    title: `[${task.key}] ${task.title}`,
    project: `Jira - ${task.projectName}`,
    projectId: `jira-${task.projectKey}`,
    tag: task.issueType === 'Bug' ? 'QA' : task.issueType === 'Story' ? 'UI' : 'Dev',
    status: mapJiraStatus(task.status),
    priority: mapJiraPriority(task.priority),
    due: task.due,
    comments: 0,
    description: `Jira issue ${task.key}. Assignee: ${task.assignee}. Status: ${task.status}.`,
  }));
};

/* ─── Style helpers ──────────────────────────────────────────── */
const getTagStyle = (tag: string) => {
  switch (tag) {
    case 'Design': return 'bg-amber-500/10 text-amber-600';
    case 'Research': return 'bg-orange-500/10 text-orange-600';
    case 'UI': return 'bg-primary/10 text-primary';
    case 'QA': return 'bg-blue-500/10 text-blue-600';
    case 'Dev': return 'bg-emerald-500/10 text-emerald-600';
    default: return 'bg-page text-text-muted';
  }
};
const getPriorityStyle = (p: string) => {
  switch (p) {
    case 'High': return 'bg-rose-500/10 text-rose-600';
    case 'Medium': return 'bg-blue-500/10 text-blue-600';
    case 'Low': return 'bg-emerald-500/10 text-emerald-600';
    default: return 'bg-page text-text-muted';
  }
};
const getStatusStyle = (s: string) => {
  switch (s) {
    case 'Completed': return 'text-emerald-600';
    case 'In Progress': return 'text-amber-600';
    case 'In Review': return 'text-blue-600';
    default: return 'text-text-muted';
  }
};
const StatusIcon = ({ status, size = 16 }: { status: string; size?: number }) => {
  switch (status) {
    case 'Completed': return <CheckCircle2 size={size} className="text-emerald-600" />;
    case 'In Progress': return <Clock size={size} className="text-amber-600" />;
    case 'In Review': return <AlertCircle size={size} className="text-blue-600" />;
    default: return <Circle size={size} className="text-text-muted" />;
  }
};

const inputCls = "w-full px-3 py-2.5 bg-page border border-transparent rounded-[12px] focus:bg-card focus:border-primary focus:ring-2 focus:ring-primary/5 transition-all text-[13px] font-medium text-text-main placeholder:text-text-muted outline-none";
const selectCls = inputCls + " appearance-none cursor-pointer";

type SortKey = 'title' | 'project' | 'status' | 'priority' | 'due';

/* ─── Task Detail Drawer (view-only) ────────────────────────── */
const TaskDrawer = ({
  task, onClose, onEdit, onDelete,
}: {
  task: Task; onClose: () => void; onEdit: () => void; onDelete: (id: string | number) => void;
}) => {
  const navigate = useNavigate();
  const progress = task.status === 'Completed' ? 100 : task.status === 'In Progress' ? 60 : task.status === 'In Review' ? 85 : 0;
  return (
    <>
      <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-40" onClick={onClose} />
      <div
        className="fixed top-0 right-0 h-full w-full max-w-[420px] bg-card z-50 flex flex-col shadow-2xl"
        style={{ animation: 'slideInRight 0.25s cubic-bezier(0.16,1,0.3,1)' }}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-border shrink-0">
          <div className="flex-1 pr-4">
            <div className="flex items-center gap-2 mb-2">
              <StatusIcon status={task.status} size={17} />
              <span className={`text-[13px] font-semibold ${getStatusStyle(task.status)}`}>{task.status}</span>
            </div>
            <h2 className="text-[17px] font-bold text-text-main leading-snug">{task.title}</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full text-text-muted hover:text-text-main hover:bg-page transition-all">
            <X size={18} />
          </button>
        </div>
        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: <FolderDot size={13} className="text-text-muted" />, label: 'Project', value: <span className="text-[13px] font-semibold text-text-main">{task.project}</span> },
              { icon: <Flag size={13} className="text-text-muted" />, label: 'Priority', value: <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${getPriorityStyle(task.priority)}`}>{task.priority}</span> },
              { icon: <Calendar size={13} className="text-text-muted" />, label: 'Due Date', value: <span className="text-[13px] font-semibold text-text-main">{task.due}</span> },
              { icon: <Tag size={13} className="text-text-muted" />, label: 'Tag', value: <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${getTagStyle(task.tag)}`}>{task.tag}</span> },
            ].map(row => (
              <div key={row.label} className="bg-page rounded-[14px] p-3.5">
                <div className="flex items-center gap-1.5 mb-1.5">{row.icon}<span className="text-[11px] font-bold text-text-muted uppercase tracking-wide">{row.label}</span></div>
                {row.value}
              </div>
            ))}
          </div>
          <div>
            <p className="text-[12px] font-bold text-text-muted uppercase tracking-wider mb-2">Description</p>
            <div className="bg-page rounded-[14px] p-4">
              <p className="text-[13px] font-medium text-text-main leading-relaxed">{task.description || 'No description provided.'}</p>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[12px] font-bold text-text-muted uppercase tracking-wider">Progress</p>
              <span className="text-[12px] font-bold text-text-main">{progress}%</span>
            </div>
            <div className="w-full h-2 bg-page rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
        {/* Footer */}
        <div className="shrink-0 border-t border-border p-4 flex items-center gap-3">
          <button
            onClick={() => navigate(`/projects/${task.projectId}`)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-[13px] font-semibold bg-primary text-white hover:bg-primary-hover transition-colors"
          >
            <ExternalLink size={14} /> Open Project
          </button>
          <button
            onClick={onEdit}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-[13px] font-semibold text-text-main border border-border hover:bg-page transition-colors"
          >
            <Edit2 size={14} /> Edit Task
          </button>
          <button
            onClick={() => { if (window.confirm('Delete this task?')) { onDelete(task.id); onClose(); } }}
            className="p-2.5 rounded-full text-rose-600 border border-rose-500/20 hover:bg-rose-500/10 transition-colors"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
      <style>{`@keyframes slideInRight{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}`}</style>
    </>
  );
};

/* ─── Edit Task Modal ────────────────────────────────────────── */
const modalInputCls = "w-full px-4 py-3 bg-page border border-transparent rounded-[14px] focus:bg-card focus:border-primary transition-all text-[14px] font-medium text-text-main placeholder:text-text-muted outline-none";
const modalSelectCls = modalInputCls + " appearance-none cursor-pointer";

const EditTaskModal = ({
  task, onClose, onSave,
}: { task: Task; onClose: () => void; onSave: (updated: Task) => void }) => {
  const [form, setForm] = useState({ ...task });
  const set = (k: keyof Task, v: string) => setForm(f => ({ ...f, [k]: v }));
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card rounded-[24px] border border-border shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[12px] bg-page flex items-center justify-center text-text-main"><Edit2 size={17} /></div>
            <div>
              <h2 className="text-[16px] font-bold text-text-main">Edit Task</h2>
              <p className="text-[12px] font-medium text-text-muted">Update the task details below.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full text-text-muted hover:text-text-main hover:bg-page transition-all"><X size={18} /></button>
        </div>
        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-[13px] font-bold text-text-main mb-2">Task Title <span className="text-rose-500">*</span></label>
            <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="Task title" className={modalInputCls} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-bold text-text-main mb-2">Tag</label>
              <div className="relative">
                <select value={form.tag} onChange={e => set('tag', e.target.value)} className={modalSelectCls}>
                  {['Design', 'Research', 'UI', 'QA', 'Dev'].map(t => <option key={t}>{t}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-[13px] font-bold text-text-main mb-2">Status</label>
              <div className="relative">
                <select value={form.status} onChange={e => set('status', e.target.value)} className={modalSelectCls}>
                  {['To Do', 'In Progress', 'In Review', 'Completed'].map(s => <option key={s}>{s}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-[13px] font-bold text-text-main mb-2">Priority</label>
              <div className="relative">
                <select value={form.priority} onChange={e => set('priority', e.target.value)} className={modalSelectCls}>
                  {['High', 'Medium', 'Low'].map(p => <option key={p}>{p}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-[13px] font-bold text-text-main mb-2">Due Date</label>
              <input type="date" className={modalInputCls} />
            </div>
          </div>
          <div>
            <label className="block text-[13px] font-bold text-text-main mb-2">Description</label>
            <textarea rows={3} value={form.description || ''} onChange={e => set('description', e.target.value)} placeholder="Task description..." className={modalInputCls + ' resize-none'} />
          </div>
        </div>
        {/* Footer */}
        <div className="flex items-center justify-between px-6 pb-6 pt-2">
          <button onClick={onClose} className="px-5 py-2.5 rounded-full text-[14px] font-semibold text-text-muted border border-border bg-card hover:bg-page transition-colors">Cancel</button>
          <button
            onClick={() => { onSave(form); onClose(); }}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-full text-[14px] font-semibold hover:bg-primary-hover transition-colors shadow-sm"
          >
            <Check size={16} /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Add Task Modal ─────────────────────────────────────────── */
const PROJECTS = [
  { name: 'Figma Design System', id: '1' },
  { name: 'BoostVibe 2.0', id: '2' },
  { name: 'ProService Desk', id: '3' },
];

const AddTaskModal = ({
  onClose, onAdd,
}: { onClose: () => void; onAdd: (task: Task) => void }) => {
  const [form, setForm] = useState({
    title: '',
    projectId: '1',
    tag: 'Design',
    status: 'To Do',
    priority: 'Medium',
    due: '',
    description: '',
  });
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleAdd = () => {
    if (!form.title.trim()) return;
    const proj = PROJECTS.find(p => p.id === form.projectId)!;
    onAdd({
      id: Date.now(),
      title: form.title.trim(),
      project: proj.name,
      projectId: proj.id,
      tag: form.tag,
      status: form.status,
      priority: form.priority,
      due: form.due
        ? new Date(form.due).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
        : 'TBD',
      comments: 0,
      description: form.description,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative bg-card rounded-[24px] border border-border shadow-2xl w-full max-w-lg mx-4 overflow-hidden"
        style={{ animation: 'modalPop 0.22s cubic-bezier(0.16,1,0.3,1)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[12px] bg-primary flex items-center justify-center text-white">
              <Plus size={17} />
            </div>
            <div>
              <h2 className="text-[16px] font-bold text-text-main">Add New Task</h2>
              <p className="text-[12px] font-medium text-text-muted">Fill in the details to create a task.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full text-text-muted hover:text-text-main hover:bg-page transition-all"><X size={18} /></button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-[13px] font-bold text-text-main mb-2">Task Title <span className="text-rose-500">*</span></label>
            <input
              autoFocus
              value={form.title}
              onChange={e => set('title', e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              placeholder="e.g. Design landing page wireframes"
              className={modalInputCls}
            />
          </div>

          {/* Project */}
          <div>
            <label className="block text-[13px] font-bold text-text-main mb-2">Project</label>
            <div className="relative">
              <select value={form.projectId} onChange={e => set('projectId', e.target.value)} className={modalSelectCls}>
                {PROJECTS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
            </div>
          </div>

          {/* Grid: Tag / Status / Priority / Due */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-bold text-text-main mb-2">Tag</label>
              <div className="relative">
                <select value={form.tag} onChange={e => set('tag', e.target.value)} className={modalSelectCls}>
                  {['Design', 'Research', 'UI', 'QA', 'Dev'].map(t => <option key={t}>{t}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-[13px] font-bold text-text-main mb-2">Status</label>
              <div className="relative">
                <select value={form.status} onChange={e => set('status', e.target.value)} className={modalSelectCls}>
                  {['To Do', 'In Progress', 'In Review', 'Completed'].map(s => <option key={s}>{s}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-[13px] font-bold text-text-main mb-2">Priority</label>
              <div className="relative">
                <select value={form.priority} onChange={e => set('priority', e.target.value)} className={modalSelectCls}>
                  {['High', 'Medium', 'Low'].map(p => <option key={p}>{p}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-[13px] font-bold text-text-main mb-2">Due Date</label>
              <input type="date" value={form.due} onChange={e => set('due', e.target.value)} className={modalInputCls} />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[13px] font-bold text-text-main mb-2">Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="Optional task description..."
              className={modalInputCls + ' resize-none'}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 pb-6 pt-2">
          <button onClick={onClose} className="px-5 py-2.5 rounded-full text-[14px] font-semibold text-text-muted border border-border bg-card hover:bg-page transition-colors">Cancel</button>
          <button
            onClick={handleAdd}
            disabled={!form.title.trim()}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-full text-[14px] font-semibold hover:bg-primary-hover transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Plus size={16} /> Create Task
          </button>
        </div>
      </div>
      <style>{`@keyframes modalPop{from{transform:scale(0.94) translateY(8px);opacity:0}to{transform:scale(1) translateY(0);opacity:1}}`}</style>
    </div>
  );
};

/* ─── Main Component ─────────────────────────────────────────── */
const Tasks = () => {
  const [jiraConnected, setJiraConnected] = useState(localStorage.getItem(JIRA_STORAGE_KEYS.connected) === 'true');
  const [jiraTasks, setJiraTasks] = useState<Task[]>(() => mapJiraTasks(readJson<JiraTask[]>(JIRA_STORAGE_KEYS.tasks, [])));
  const [tasks, setTasks] = useState<Task[]>(ALL_TASKS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatus] = useState('All');
  const [tagFilter, setTag] = useState('All');
  const [sortKey, setSortKey] = useState<SortKey>('due');
  const [sortAsc, setSortAsc] = useState(true);
  const [selected, setSelected] = useState<Array<string | number>>([]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [showAddTask, setShowAddTask] = useState(false);

  useEffect(() => {
    const handleStorage = () => {
      setJiraConnected(localStorage.getItem(JIRA_STORAGE_KEYS.connected) === 'true');
      setJiraTasks(mapJiraTasks(readJson<JiraTask[]>(JIRA_STORAGE_KEYS.tasks, [])));
    };
    window.addEventListener('storage', handleStorage);

    const handler = () => setShowAddTask(true);
    window.addEventListener('openAddTask', handler);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('openAddTask', handler);
    };
  }, []);

  const totalTasks = jiraConnected ? [...tasks, ...jiraTasks] : tasks;

  const total = totalTasks.length;
  const completed = totalTasks.filter(t => t.status === 'Completed').length;
  const inProgress = totalTasks.filter(t => t.status === 'In Progress').length;
  const todo = totalTasks.filter(t => t.status === 'To Do').length;

  const filtered = totalTasks
    .filter(t => {
      const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.project.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'All' || t.status === statusFilter;
      const matchTag = tagFilter === 'All' || t.tag === tagFilter;
      return matchSearch && matchStatus && matchTag;
    })
    .sort((a, b) => {
      const av = a[sortKey] as string;
      const bv = b[sortKey] as string;
      return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
    });

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(true); }
  };

  const toggleSelect = (id: string | number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };
  const toggleAll = () =>
    setSelected(selected.length === filtered.length ? [] : filtered.map(t => t.id));

  const SortIcon = ({ col }: { col: SortKey }) =>
    sortKey === col
      ? sortAsc ? <ChevronUp size={13} className="text-text-main" /> : <ChevronDown size={13} className="text-text-main" />
      : <ChevronDown size={13} className="text-border" />;

  const thCls = "px-4 py-3 text-left text-[12px] font-bold text-text-muted uppercase tracking-wider select-none cursor-pointer hover:text-text-main transition-colors";

  return (
    <Layout>
      <div className="w-full">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-[20px] font-bold text-text-main">Tasks</h1>
            <p className="text-[13px] font-medium text-text-muted mt-0.5">All tasks across every project</p>
          </div>
          <button
            onClick={() => setShowAddTask(true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-full text-[14px] font-semibold hover:bg-primary-hover transition-colors shadow-sm"
          >
            <Plus size={18} /> Add Task
          </button>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Tasks', value: total, color: 'bg-page text-text-main' },
            { label: 'Completed', value: completed, color: 'bg-emerald-500/10 text-emerald-600' },
            { label: 'In Progress', value: inProgress, color: 'bg-amber-500/10 text-amber-600' },
            { label: 'To Do', value: todo, color: 'bg-blue-500/10 text-blue-600' },
          ].map(k => (
            <div key={k.label} className="bg-card p-5 rounded-[20px] border border-border flex flex-col gap-1">
              <span className="text-[13px] font-semibold text-text-muted">{k.label}</span>
              <div className="flex items-end gap-3 mt-1">
                <span className="text-[28px] font-bold text-text-main leading-none">{k.value}</span>
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full mb-0.5 ${k.color}`}>
                  {total > 0 ? Math.round((k.value / total) * 100) : 0}%
                </span>
              </div>
              <div className="w-full h-1 bg-page rounded-full mt-2">
                <div className="h-full bg-primary rounded-full" style={{ width: total > 0 ? `${(k.value / total) * 100}%` : '0%' }} />
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-card rounded-[20px] border border-border p-4 mb-4 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 flex-1 min-w-[200px] px-4 py-2.5 bg-page rounded-full">
            <Search size={15} className="text-text-muted shrink-0" />
            <input type="text" placeholder="Search tasks or projects..." value={search} onChange={e => setSearch(e.target.value)}
              className="bg-transparent outline-none text-[13px] font-medium text-text-main placeholder:text-text-muted w-full border-none shadow-none"
              style={{ background: 'transparent', border: 'none', boxShadow: 'none', outline: 'none' }} />
          </div>
          <div className="relative">
            <select value={statusFilter} onChange={e => setStatus(e.target.value)} className="appearance-none pl-4 pr-8 py-2.5 bg-page rounded-full text-[13px] font-semibold text-text-main outline-none cursor-pointer">
              {['All', 'To Do', 'In Progress', 'In Review', 'Completed'].map(s => <option key={s}>{s}</option>)}
            </select>
            <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
          </div>
          <div className="relative">
            <select value={tagFilter} onChange={e => setTag(e.target.value)} className="appearance-none pl-4 pr-8 py-2.5 bg-page rounded-full text-[13px] font-semibold text-text-main outline-none cursor-pointer">
              {['All', 'Design', 'Research', 'UI', 'QA', 'Dev'].map(t => <option key={t}>{t}</option>)}
            </select>
            <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
          </div>
          <div className="flex items-center gap-1.5 px-4 py-2.5 bg-page rounded-full cursor-pointer hover:bg-card border border-border transition-colors text-[13px] font-semibold text-text-main">
            <SlidersHorizontal size={14} /> More Filters
          </div>
          {selected.length > 0 && (
            <span className="ml-auto text-[12px] font-semibold text-text-muted">{selected.length} selected</span>
          )}
        </div>

        {/* Table */}
        <div className="bg-card rounded-[20px] border border-border overflow-hidden">
          <table className="w-full" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 w-10 text-center">
                  <input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleAll}
                    className="w-4 h-4 rounded accent-primary cursor-pointer" />
                </th>
                <th className={thCls} onClick={() => handleSort('title')}><div className="flex items-center gap-1.5">Task <SortIcon col="title" /></div></th>
                <th className={thCls} onClick={() => handleSort('project')}><div className="flex items-center gap-1.5">Project <SortIcon col="project" /></div></th>
                <th className={thCls}>Tag</th>
                <th className={thCls} onClick={() => handleSort('status')}><div className="flex items-center gap-1.5">Status <SortIcon col="status" /></div></th>
                <th className={thCls} onClick={() => handleSort('priority')}><div className="flex items-center gap-1.5">Priority <SortIcon col="priority" /></div></th>
                <th className={thCls} onClick={() => handleSort('due')}><div className="flex items-center gap-1.5">Due Date <SortIcon col="due" /></div></th>
                <th className="px-4 py-3 w-10 text-center" />
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-16 text-[14px] font-semibold text-text-muted">No tasks match your filters.</td></tr>
              ) : filtered.map((task, i) => {
                const isSelected = selected.includes(task.id);
                const isActive = activeTask?.id === task.id;
                const isLast = i === filtered.length - 1;
                return (
                  <tr
                    key={task.id}
                    onClick={() => setActiveTask(task)}
                    className={`group transition-colors cursor-pointer ${isActive ? 'bg-page' : isSelected ? 'bg-page/50' : 'hover:bg-page/30'} ${!isLast ? 'border-b border-border' : ''}`}
                  >
                    <td className="px-4 py-3.5 w-10 text-center">
                      <input type="checkbox" checked={isSelected} onChange={() => { }} onClick={e => toggleSelect(task.id, e)} className="w-4 h-4 rounded accent-primary cursor-pointer" />
                    </td>
                    <td className="px-4 py-3.5 min-w-[200px]">
                      <div className="flex items-center gap-2.5">
                        <StatusIcon status={task.status} />
                        <span className={`text-[14px] font-semibold ${task.status === 'Completed' ? 'line-through text-text-muted' : 'text-text-main'}`}>{task.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 min-w-[160px]">
                      <span className="text-[13px] font-medium text-text-muted">{task.project}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap ${getTagStyle(task.tag)}`}>{task.tag}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className={`flex items-center gap-1.5 text-[13px] font-semibold ${getStatusStyle(task.status)}`}>{task.status}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap ${getPriorityStyle(task.priority)}`}>{task.priority}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5 text-[13px] font-medium text-text-muted whitespace-nowrap">
                        <Calendar size={13} className="text-text-muted" />{task.due}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 w-10 text-center">
                      <button onClick={e => e.stopPropagation()} className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-page text-text-muted hover:text-text-main">
                        <MoreHorizontal size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="flex items-center justify-between px-5 py-3.5 border-t border-border">
            <span className="text-[12px] font-semibold text-text-muted">Showing {filtered.length} of {total} tasks</span>
            <div className="flex items-center gap-2">
              <button className="px-4 py-1.5 rounded-full text-[12px] font-semibold text-text-muted border border-border hover:bg-page transition-colors">Previous</button>
              <button className="px-4 py-1.5 rounded-full text-[12px] font-semibold bg-primary text-white hover:bg-primary-hover transition-colors">Next</button>
            </div>
          </div>
        </div>
      </div>

      {activeTask && (
        <TaskDrawer
          task={activeTask}
          onClose={() => setActiveTask(null)}
          onEdit={() => setEditTask(activeTask)}
          onDelete={(id) => {
            setTasks(prev => prev.filter(t => t.id !== id));
            setSelected(prev => prev.filter(x => x !== id));
          }}
        />
      )}

      {editTask && (
        <EditTaskModal
          task={editTask}
          onClose={() => setEditTask(null)}
          onSave={(updated) => {
            setTasks(prev => prev.map(t => t.id === updated.id ? updated : t));
            setActiveTask(updated);
            setEditTask(null);
          }}
        />
      )}

      {showAddTask && (
        <AddTaskModal
          onClose={() => setShowAddTask(false)}
          onAdd={(newTask) => {
            setTasks(prev => [newTask, ...prev]);
            setShowAddTask(false);
          }}
        />
      )}
    </Layout>
  );
};

export default Tasks;
