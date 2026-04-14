import React, { useState, useRef, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import {
  FolderPlus, Calendar, Layout as LayoutIcon, BarChart3, Filter, Grid, List, ChevronDown, Check
} from 'lucide-react';

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
      case 'Completed': return 'bg-[#E8F5E9] text-[#2E7D32]';
      case 'In Progress': return 'bg-[#FFF3E0] text-[#EF6C00]';
      case 'Pending': return 'bg-[#E1F5FE] text-[#0288D1]';
      case 'Planning': return 'bg-[#F3E5F5] text-[#7B1FA2]';
      case 'On Hold': return 'bg-[#E8EAF6] text-[#3F51B5]';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const getPriorityStyle = (p: string) => {
    switch (p) {
      case 'High': return 'bg-[#FFEBEE] text-[#D32F2F]';
      case 'Medium': return 'bg-[#E1F5FE] text-[#0288D1]';
      case 'Low': return 'bg-[#F1F8E9] text-[#689F38]';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="bg-white p-5 rounded-[20px] border border-[#EEEEEE] flex flex-col hover:shadow-xl transition-all duration-300 group cursor-pointer h-full">
      {/* Header: Title and Status */}
      <div className="flex justify-between items-start mb-0.5">
        <h3 className="text-[18px] font-bold text-[#1A1A1A] tracking-tight group-hover:text-blue-600 transition-colors">
          {title}
        </h3>
        <span className={`px-3 py-1 rounded-full text-[12px] font-semibold ${getStatusStyle(status)}`}>
          {status}
        </span>
      </div>

      {/* Description */}
      <p className="text-[14px] text-[#666666] mb-3">
        {description}
      </p>

      {/* Deadline */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-[14px] text-[#666666]">
          <Calendar size={16} className="text-[#999999]" />
          <span className="font-medium text-[#1A1A1A]">Deadline:</span>
          <span>{deadline}</span>
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex-1 bg-[#F5F5F5] rounded-full h-[6px]">
          <div
            className="bg-[#1A1A1A] h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <span className="text-[14px] font-bold text-[#1A1A1A] shrink-0">{progress}%</span>
      </div>

      {/* Stats - Left and Right */}
      <div className="flex items-center justify-between mb-4 border-b border-[#F5F5F5] pb-4">
        <div className="text-[12px] font-medium text-[#999999]">
          {tasks} task
        </div>
        <div className="text-[12px] font-medium text-[#999999] text-right">
          {activities} activities
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-y-3">
        <div>
          <p className="text-[13px] text-[#999999] mb-0.5">Start Date</p>
          <p className="text-[15px] font-bold text-[#1A1A1A]">{startDate}</p>
        </div>
        <div className="text-right">
          <p className="text-[13px] text-[#999999] mb-0.5">Priority</p>
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
      case 'Completed': return 'bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9]';
      case 'In Progress': return 'bg-[#FFF3E0] text-[#EF6C00] border-[#FFE0B2]';
      case 'Pending': return 'bg-[#E1F5FE] text-[#0288D1] border-[#B3E5FC]';
      case 'Planning': return 'bg-[#F3E5F5] text-[#7B1FA2] border-[#E1BEE7]';
      case 'On Hold': return 'bg-[#E8EAF6] text-[#3F51B5] border-[#C5CAE9]';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const getPriorityStyle = (p: string) => {
    switch (p) {
      case 'High': return 'text-[#D32F2F]';
      case 'Medium': return 'text-[#0288D1]';
      case 'Low': return 'text-[#689F38]';
      default: return 'text-slate-600';
    }
  };

  return (
    <div className="bg-white rounded-[20px] border border-[#EEEEEE] overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-[#EEEEEE]">
            <th className="px-6 py-4 text-[13px] font-bold text-[#999999] uppercase tracking-wider">Project Name</th>
            <th className="px-6 py-4 text-[13px] font-bold text-[#999999] uppercase tracking-wider">Status</th>
            <th className="px-6 py-4 text-[13px] font-bold text-[#999999] uppercase tracking-wider">Progress</th>
            <th className="px-6 py-4 text-[13px] font-bold text-[#999999] uppercase tracking-wider">Deadline</th>
            <th className="px-6 py-4 text-[13px] font-bold text-[#999999] uppercase tracking-wider">Priority</th>
            <th className="px-6 py-4 text-[13px] font-bold text-[#999999] uppercase tracking-wider">Start Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#EEEEEE]">
          {projects.map((project: any) => (
            <tr
              key={project.id}
              onClick={() => navigate(`/projects/${project.id}`)}
              className="hover:bg-slate-50 transition-colors cursor-pointer group"
            >
              <td className="px-6 py-5">
                <p className="text-[15px] font-bold text-[#1A1A1A] group-hover:text-blue-600 transition-colors">{project.title}</p>
                <p className="text-[13px] text-[#999999] mt-0.5 truncate max-w-[200px]">{project.description}</p>
              </td>
              <td className="px-6 py-5">
                <span className={`px-3 py-1 rounded-full text-[12px] font-semibold border ${getStatusStyle(project.status)}`}>
                  {project.status}
                </span>
              </td>
              <td className="px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="w-24 bg-[#F5F5F5] rounded-full h-[6px]">
                    <div
                      className="bg-[#1A1A1A] h-full rounded-full"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-[13px] font-bold text-[#1A1A1A]">{project.progress}%</span>
                </div>
              </td>
              <td className="px-6 py-5">
                <p className="text-[14px] text-[#1A1A1A] font-medium">{project.deadline}</p>
              </td>
              <td className="px-6 py-5">
                <p className={`text-[14px] font-bold ${getPriorityStyle(project.priority)}`}>{project.priority}</p>
              </td>
              <td className="px-6 py-5">
                <p className="text-[14px] text-[#1A1A1A] font-medium">{project.startDate}</p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const MOCK_PROJECTS = [
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

const Projects = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeStatus, setActiveStatus] = useState('All Status');
  const filterRef = useRef<HTMLDivElement>(null);

  const statuses = ['All Status', 'In Progress', 'Pending', 'Completed', 'Planning', 'On Hold'];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredProjects = MOCK_PROJECTS.filter(p =>
    activeStatus === 'All Status' || p.status === activeStatus
  );

  return (
    <Layout>
      <div className="w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-[20px] font-bold text-[#1A1A1A]">Total {filteredProjects.length} projects</h1>
          </div>

          <div className="flex items-center gap-4">
            {/* View Toggle */}
            <div className="flex items-center bg-white border border-[#EEEEEE] rounded-full p-1 shadow-sm">
              <button
                onClick={() => setViewMode('card')}
                className={`p-2 rounded-full transition-all ${viewMode === 'card' ? 'bg-[#1A1A1A] text-white' : 'text-[#999999] hover:text-[#1A1A1A]'}`}
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-full transition-all ${viewMode === 'table' ? 'bg-[#1A1A1A] text-white' : 'text-[#999999] hover:text-[#1A1A1A]'}`}
              >
                <List size={18} />
              </button>
            </div>

            {/* Filter Dropdown */}
            <div className="relative" ref={filterRef}>
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className={`flex items-center gap-2 px-5 py-2.5 bg-white border border-[#EEEEEE] rounded-full text-[14px] font-semibold text-[#1A1A1A] hover:bg-gray-50 transition-colors ${filterOpen ? 'ring-2 ring-black/5' : ''}`}
              >
                <Filter size={18} />
                {activeStatus}
                <ChevronDown size={16} className={`transition-transform duration-300 ${filterOpen ? 'rotate-180' : ''}`} />
              </button>

              {filterOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-[#EEEEEE] rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
                  <div className="p-2">
                    {statuses.map(status => (
                      <button
                        key={status}
                        onClick={() => {
                          setActiveStatus(status);
                          setFilterOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-[14px] font-medium transition-colors ${activeStatus === status ? 'bg-slate-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'}`}
                      >
                        {status}
                        {activeStatus === status && <Check size={16} />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => navigate('/projects/new')}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#1A1A1A] text-white rounded-full text-[14px] font-semibold hover:bg-black transition-colors shadow-sm"
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
