import React, { useState, useRef, useEffect } from 'react';
import { Layout } from '../../components/layout/Layout';
import { useNavigate } from 'react-router-dom';
import {
  FolderPlus, Calendar, Layout as LayoutIcon, BarChart3, Filter, Grid, List, ChevronDown, Check
} from 'lucide-react';
import type { JiraProject, JiraTask } from '../../types/jira';
import { JIRA_STORAGE_KEYS } from '../../types/jira';

const ProjectCard = ({
  title,
  status,
  description,
  deadline,
  progress,
  tasks,
  activities,
  startDate,
  priority
}: any) => {
  const getStatusStyle = (type: string) => {
    switch (type) {
      case 'Completed': return 'bg-emerald-500/10 text-emerald-600';
      case 'In Progress': return 'bg-amber-500/10 text-amber-600';
      case 'Pending': return 'bg-blue-500/10 text-blue-600';
      case 'Planning': return 'bg-primary/10 text-primary';
      case 'On Hold': return 'bg-page text-text-muted';
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

  return (
    <div className="bg-card p-5 rounded-[20px] border border-border flex flex-col hover:shadow-xl transition-all duration-300 group cursor-pointer h-full">
      {/* Header: Title and Status */}
      <div className="flex justify-between items-start mb-0.5">
        <h3 className="text-[18px] font-bold text-text-main tracking-tight group-hover:text-primary transition-colors">
          {title}
        </h3>
        <span className={`px-3 py-1 rounded-full text-[12px] font-semibold ${getStatusStyle(status)}`}>
          {status}
        </span>
      </div>

      {/* Description */}
      <p className="text-[14px] text-text-muted mb-3 line-clamp-2">
        {description}
      </p>

      {/* Deadline */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-[14px] text-text-muted">
          <Calendar size={16} />
          <span className="font-semibold text-text-main">Deadline:</span>
          <span className="font-medium text-text-muted">{deadline}</span>
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex-1 bg-page rounded-full h-[6px]">
          <div
            className="bg-primary h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <span className="text-[14px] font-bold text-text-main shrink-0">{progress}%</span>
      </div>

      {/* Stats - Left and Right */}
      <div className="flex items-center justify-between mb-4 border-b border-border pb-4">
        <div className="text-[12px] font-bold text-text-muted">
          {tasks} task
        </div>
        <div className="text-[12px] font-bold text-text-muted text-right">
          {activities} activities
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-y-3 mt-auto">
        <div>
          <p className="text-[12px] font-bold text-text-muted mb-0.5 uppercase tracking-wider">Start Date</p>
          <p className="text-[15px] font-bold text-text-main">{startDate}</p>
        </div>
        <div className="text-right">
          <p className="text-[12px] font-bold text-text-muted mb-0.5 uppercase tracking-wider">Priority</p>
          <div className="flex justify-end">
            <span className={`px-4 py-1.5 rounded-full text-[13px] font-bold ${getPriorityStyle(priority)}`}>
              {priority}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProjectTable = ({ projects, navigate }: any) => {
  const getStatusStyle = (type: string) => {
    switch (type) {
      case 'Completed': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
      case 'In Progress': return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      case 'Pending': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'Planning': return 'bg-primary/10 text-primary border-primary/20';
      case 'On Hold': return 'bg-page text-text-muted border-border';
      default: return 'bg-page text-text-muted border-border';
    }
  };

  const getPriorityStyle = (p: string) => {
    switch (p) {
      case 'High': return 'text-rose-600';
      case 'Medium': return 'text-blue-600';
      case 'Low': return 'text-emerald-600';
      default: return 'text-text-muted';
    }
  };

  return (
    <div className="bg-card rounded-[20px] border border-border overflow-hidden shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-page border-b border-border">
            <th className="px-6 py-4 text-[13px] font-bold text-text-muted uppercase tracking-wider">Project Name</th>
            <th className="px-6 py-4 text-[13px] font-bold text-text-muted uppercase tracking-wider">Status</th>
            <th className="px-6 py-4 text-[13px] font-bold text-text-muted uppercase tracking-wider">Progress</th>
            <th className="px-6 py-4 text-[13px] font-bold text-text-muted uppercase tracking-wider">Deadline</th>
            <th className="px-6 py-4 text-[13px] font-bold text-text-muted uppercase tracking-wider">Priority</th>
            <th className="px-6 py-4 text-[13px] font-bold text-text-muted uppercase tracking-wider">Start Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {projects.map((project: any) => (
            <tr
              key={project.id}
              onClick={() => navigate(`/projects/${project.id}`)}
              className="hover:bg-page transition-colors cursor-pointer group"
            >
              <td className="px-6 py-5">
                <p className="text-[15px] font-bold text-text-main group-hover:text-primary transition-colors">{project.title}</p>
                <p className="text-[13px] text-text-muted mt-0.5 truncate max-w-[200px]">{project.description}</p>
              </td>
              <td className="px-6 py-5">
                <span className={`px-3 py-1 rounded-full text-[12px] font-semibold border ${getStatusStyle(project.status)}`}>
                  {project.status}
                </span>
              </td>
              <td className="px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="w-24 bg-page rounded-full h-[6px]">
                    <div
                      className="bg-primary h-full rounded-full"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-[13px] font-bold text-text-main">{project.progress}%</span>
                </div>
              </td>
              <td className="px-6 py-5">
                <p className="text-[14px] text-text-main font-medium">{project.deadline}</p>
              </td>
              <td className="px-6 py-5">
                <p className={`text-[14px] font-bold ${getPriorityStyle(project.priority)}`}>{project.priority}</p>
              </td>
              <td className="px-6 py-5">
                <p className="text-[14px] text-text-main font-medium">{project.startDate}</p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/* ─── Types ──────────────────────────────────────────────────── */
interface Project {
  id: string | number;
  title: string;
  description: string;
  status: string;
  deadline: string;
  progress: number;
  tasks: number;
  activities: number;
  startDate: string;
  priority: string;
  isJira?: boolean; // Optional property
}

const MOCK_PROJECTS: Project[] = [
  {
    id: 1,
    title: "Figma Design System",
    description: "Component library for design system",
    status: "In Progress",
    deadline: "Feb 5, 2026",
    progress: 80,
    tasks: 20,
    activities: 75,
    startDate: "Jan 30, 2026",
    priority: "High"
  },
  {
    id: 2,
    title: "Mobile App Design",
    description: "Different niche base design",
    status: "Pending",
    deadline: "Mar 10, 2026",
    progress: 60,
    tasks: 14,
    activities: 50,
    startDate: "Jan 10, 2026",
    priority: "High"
  },
  {
    id: 3,
    title: "Website UI",
    description: "Multiple industry website design",
    status: "Completed",
    deadline: "Jan 30, 2026",
    progress: 30,
    tasks: 18,
    activities: 24,
    startDate: "Jan 14, 2026",
    priority: "Medium"
  },
  {
    id: 4,
    title: "E commerce Website",
    description: "Clothing Company website",
    status: "Planning",
    deadline: "Feb 25, 2026",
    progress: 50,
    tasks: 10,
    activities: 8,
    startDate: "Jan 20, 2026",
    priority: "Low"
  },
  {
    id: 5,
    title: "High Fidelity Wireframe",
    description: "Mobile app design wireframe",
    status: "On Hold",
    deadline: "Mar 12, 2026",
    progress: 70,
    tasks: 15,
    activities: 20,
    startDate: "Jan 25, 2026",
    priority: "Low"
  },
  {
    id: 6,
    title: "User Flow",
    description: "SaaS dashboard user flow",
    status: "In Progress",
    deadline: "Jan 26, 2026",
    progress: 90,
    tasks: 5,
    activities: 10,
    startDate: "Jan 18, 2026",
    priority: "High"
  }
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

const mapJiraProjects = (projects: JiraProject[], tasks: JiraTask[]): Project[] => {
  return projects.map(project => {
    const projectTasks = tasks.filter(task => task.projectKey === project.key);
    const completed = projectTasks.filter(task => /done|complete|closed/i.test(task.status)).length;
    const progress = projectTasks.length > 0 ? Math.round((completed / projectTasks.length) * 100) : 0;
    const nextDue = projectTasks.find(task => task.due !== 'TBD')?.due ?? 'TBD';

    return {
      id: `jira-${project.key}`,
      title: `[Jira] ${project.name}`,
      description: `${project.key} · ${project.projectTypeKey ?? 'Jira project'}`,
      status: progress === 100 && projectTasks.length > 0 ? 'Completed' : 'In Progress',
      deadline: nextDue,
      progress,
      tasks: projectTasks.length,
      activities: projectTasks.length,
      startDate: 'Synced from Jira',
      priority: 'Medium',
      isJira: true,
    };
  });
};

const Projects = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeStatus, setActiveStatus] = useState('All Status');
  const [jiraConnected, setJiraConnected] = useState(localStorage.getItem('jira_connected') === 'true');
  const [jiraProjects, setJiraProjects] = useState<Project[]>(() => mapJiraProjects(
    readJson<JiraProject[]>(JIRA_STORAGE_KEYS.projects, []),
    readJson<JiraTask[]>(JIRA_STORAGE_KEYS.tasks, []),
  ));
  const filterRef = useRef<HTMLDivElement>(null);

  const statuses = ['All Status', 'In Progress', 'Pending', 'Completed', 'Planning', 'On Hold'];

  useEffect(() => {
    const handleStorage = () => {
      setJiraConnected(localStorage.getItem(JIRA_STORAGE_KEYS.connected) === 'true');
      setJiraProjects(mapJiraProjects(
        readJson<JiraProject[]>(JIRA_STORAGE_KEYS.projects, []),
        readJson<JiraTask[]>(JIRA_STORAGE_KEYS.tasks, []),
      ));
    };
    window.addEventListener('storage', handleStorage);
    
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('storage', handleStorage);
      document.removeEventListener('mousedown', handleClickOutside);
    }
  }, []);

  const allProjects = jiraConnected ? [...MOCK_PROJECTS, ...jiraProjects] : MOCK_PROJECTS;

  const [activeSource, setActiveSource] = useState('All Sources');
  const sources = ['All Sources', 'Local', 'Jira'];

  const filteredProjects = allProjects.filter(p => {
    const matchesStatus = activeStatus === 'All Status' || p.status === activeStatus;
    const matchesSource = activeSource === 'All Sources' || 
                         (activeSource === 'Jira' && p.isJira) || 
                         (activeSource === 'Local' && !p.isJira);
    return matchesStatus && matchesSource;
  });

  return (
    <Layout>
      <div className="w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-[20px] font-bold text-text-main">Total {filteredProjects.length} projects</h1>
          </div>

          <div className="flex items-center gap-4">
            {/* View Toggle */}
            <div className="flex items-center bg-card border border-border rounded-full p-1 shadow-sm">
              <button
                onClick={() => setViewMode('card')}
                className={`p-2 rounded-full transition-all ${viewMode === 'card' ? 'text-white' : 'text-text-muted hover:text-text-main'}`}
                style={viewMode === 'card' ? { backgroundColor: 'var(--primary)' } : {}}
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-full transition-all ${viewMode === 'table' ? 'text-white' : 'text-text-muted hover:text-text-main'}`}
                style={viewMode === 'table' ? { backgroundColor: 'var(--primary)' } : {}}
              >
                <List size={18} />
              </button>
            </div>

            {/* Filter Dropdown */}
            <div className="relative">
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className={`flex items-center gap-2 px-5 py-2.5 bg-card border border-border rounded-full text-[14px] font-semibold text-text-main hover:bg-page transition-colors ${filterOpen ? 'ring-2 ring-primary/10' : ''}`}
              >
                <Filter size={18} />
                {activeStatus}
                <ChevronDown size={16} className={`transition-transform duration-300 ${filterOpen ? 'rotate-180' : ''}`} />
              </button>

              {filterOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
                  <div className="p-2">
                    {statuses.map(status => (
                      <button
                        key={status}
                        onClick={() => {
                          setActiveStatus(status);
                          setFilterOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-[14px] font-bold transition-colors ${activeStatus === status ? 'bg-primary/10 text-primary' : 'text-text-muted hover:bg-page hover:text-text-main'}`}
                      >
                        {status}
                        {activeStatus === status && <Check size={16} />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Source Filter */}
            <div className="bg-card border border-border rounded-full p-1 flex gap-1">
              {sources.map(s => (
                <button
                  key={s}
                  onClick={() => setActiveSource(s)}
                  className={`px-4 py-1.5 rounded-full text-[13px] font-bold transition-all ${activeSource === s ? 'bg-primary text-white' : 'text-text-muted hover:text-text-main'}`}
                >
                  {s}
                </button>
              ))}
            </div>

            <button
              onClick={() => navigate('/projects/new')}
              className="flex items-center gap-2 px-6 py-2.5 text-white rounded-full text-[14px] font-semibold transition-colors shadow-sm"
              style={{ backgroundColor: 'var(--primary)' }}
            >
              <FolderPlus size={18} />
              New Project
            </button>
          </div>
        </div>

        {/* Content View */}
        {viewMode === 'card' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map(project => (
              <div key={project.id} onClick={() => navigate(`/projects/${project.id}`)}>
                <ProjectCard {...project} />
              </div>
            ))}
          </div>
        ) : (
          <ProjectTable projects={filteredProjects} navigate={navigate} />
        )}
      </div>
    </Layout>
  );
};

export default Projects;
