import React from 'react';
import {
  LayoutDashboard, FolderDot, CheckSquare, Calendar,
  Zap, Settings, Search, BarChart3,
  Bell, PanelLeftClose, PanelLeftOpen, User, LogOut, ChevronDown, Plus,
  Timer, FileText, Plug
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

const SidebarItem = ({ icon: Icon, label, active = false, badge, hasDropdown = false, isCollapsed = false, path, onPlusClick }: any) => {
  const navigate = useNavigate();
  return (
    <div 
      className={`flex items-center ${isCollapsed ? 'justify-center mx-2' : 'justify-between px-4'} py-2.5 rounded-xl cursor-pointer transition-all duration-200 ${active ? 'bg-violet-100/50 text-violet-700 font-semibold' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800 font-medium'}`}
      title={isCollapsed ? label : undefined}
      onClick={() => path && navigate(path)}
    >
      <div className={`flex items-center ${isCollapsed ? '' : 'gap-3'}`}>
        <Icon size={20} className={active ? 'text-violet-600' : 'text-slate-400'} />
        {!isCollapsed && <span className="text-sm">{label}</span>}
      </div>
      {!isCollapsed && badge && (
        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-500">
          {badge}
        </span>
      )}
      {!isCollapsed && hasDropdown && (
        <button
          onClick={(e) => { e.stopPropagation(); onPlusClick?.(); }}
          className="p-0.5 rounded-md hover:bg-violet-100 hover:text-violet-600 transition-colors text-slate-400"
          title="Add Task"
        >
          <Plus size={16} />
        </button>
      )}
    </div>
  );
};

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = React.useState(false);
  const location = useLocation();

  return (
    <div className="flex h-screen bg-[#f5f5f5] overflow-hidden font-sans">
      {/* Left Sidebar */}
      <aside className={`${isSidebarCollapsed ? 'w-20' : 'w-64'} transition-all duration-300 bg-white flex flex-col border-r border-slate-100 shrink-0 h-full shadow-[4px_0_24px_rgba(0,0,0,0.02)]`}>
        <div className={`py-6 flex items-center ${isSidebarCollapsed ? 'flex-col gap-4 px-2 justify-center' : 'gap-2 px-6'}`}>
          <div className="text-violet-600 bg-violet-100 p-1.5 rounded-lg shrink-0">
            <Zap size={24} fill="currentColor" />
          </div>
          {!isSidebarCollapsed && <span className="text-xl font-bold tracking-tight text-slate-800 transition-shadow">ProFlow</span>}
        </div>

        <div className={`flex-1 overflow-y-auto ${isSidebarCollapsed ? 'px-2' : 'px-4'} space-y-8 pb-6 custom-scrollbar`}>
          <div>
            <div className="space-y-1">
              <SidebarItem icon={LayoutDashboard} label="Dashboard" active={location.pathname === '/dashboard'} path="/dashboard" isCollapsed={isSidebarCollapsed} />
              <SidebarItem icon={FolderDot} label="Projects" active={location.pathname === '/projects'} path="/projects" isCollapsed={isSidebarCollapsed} />
              <SidebarItem icon={CheckSquare} label="Tasks" hasDropdown isCollapsed={isSidebarCollapsed} path="/tasks" active={location.pathname === '/tasks'} onPlusClick={() => window.dispatchEvent(new CustomEvent('openAddTask'))} />
              <SidebarItem icon={Calendar} label="Calendar" path="/calendar" active={location.pathname === '/calendar'} isCollapsed={isSidebarCollapsed} />
              <SidebarItem icon={Timer} label="Timer" path="/timer" active={location.pathname === '/timer'} isCollapsed={isSidebarCollapsed} />
              <SidebarItem icon={FileText} label="Timesheet" path="/timesheet" active={location.pathname === '/timesheet'} isCollapsed={isSidebarCollapsed} />
              <SidebarItem icon={BarChart3} label="Reports" path="/reports" active={location.pathname === '/reports'} isCollapsed={isSidebarCollapsed} />
              <SidebarItem icon={Plug} label="Integrations" path="/integrations" active={location.pathname === '/integrations'} isCollapsed={isSidebarCollapsed} />
            </div>
          </div>
        </div>

        <div className={`p-4 mt-auto border-t border-slate-100`}>
          {!isSidebarCollapsed && (
            <div className="bg-violet-50 rounded-2xl p-4 flex flex-col gap-1 mb-4 relative overflow-hidden group hover:translate-y-[-2px] transition-transform cursor-pointer border border-violet-100">
              <div className="absolute top-0 right-0 p-4 opacity-10 text-violet-600">
                <Zap size={48} className="transform rotate-12" />
              </div>
              <div className="flex items-center gap-2 text-violet-700 font-bold z-10">
                <Zap size={16} fill="currentColor" /> Activate Premium
              </div>
              <p className="text-xs text-slate-500 font-medium z-10">Unlock all features on ProFlow</p>
            </div>
          )}

          <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center mx-2' : 'gap-3 px-4'} py-2 text-slate-500 hover:text-slate-800 font-medium cursor-pointer transition-colors`} title={isSidebarCollapsed ? "Menu Settings" : undefined}>
            <Settings size={20} />
            {!isSidebarCollapsed && <span className="text-sm">Menu Settings</span>}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full bg-[#f5f5f5] overflow-hidden">
        {/* Header */}
        <header className="p-[12px] bg-white border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-5">
            <div 
              className="p-2 border border-slate-200 rounded-xl text-slate-500 cursor-pointer hover:bg-slate-50 hover:text-slate-800 transition-colors shrink-0 bg-white"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              title="Toggle Sidebar"
            >
              {isSidebarCollapsed ? <PanelLeftOpen size={20} strokeWidth={2} /> : <PanelLeftClose size={20} strokeWidth={2} />}
            </div>
            
            <div className="flex items-center bg-slate-50 border border-slate-100 px-4 py-2 rounded-xl w-96 hover:shadow-sm focus-within:shadow-sm focus-within:border-violet-200 transition-all focus-within:bg-white text-slate-500">
              <Search size={18} className="mr-2 opacity-50" />
              <input
                type="text"
                placeholder="Search insights..."
                className="bg-transparent outline-none text-sm font-medium w-full text-slate-700 placeholder:font-normal placeholder:text-slate-400"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 hover:text-violet-600 transition-colors relative">
                <div className="absolute top-2.5 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></div>
                <Bell size={18} />
              </button>
            </div>

            <div className="h-8 w-[1px] bg-slate-200"></div>

            <div className="relative">
              <div 
                className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-1.5 rounded-xl transition-colors"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              >
                <div className="text-right hidden md:block">
                  <p className="text-sm font-bold text-slate-800 leading-tight">Shakib Ali</p>
                  <p className="text-xs text-slate-400 font-medium">Designer</p>
                </div>
                <img src="https://ui-avatars.com/api/?name=Shakib+Ali&background=FBBF24&color=fff" alt="User" className="w-10 h-10 rounded-xl" />
                <ChevronDown size={16} className={`text-slate-400 ml-1 transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
              </div>

              {isProfileMenuOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40"
                    onClick={() => setIsProfileMenuOpen(false)}
                  ></div>
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full right-0 mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] z-50 py-2 overflow-hidden"
                  >
                    <div className="px-4 py-2.5 hover:bg-slate-50 cursor-pointer flex items-center gap-3 text-sm font-semibold text-slate-700 transition-colors">
                      <User size={16} className="text-slate-400" />
                      Profile
                    </div>
                    <div className="h-px bg-slate-100 my-1"></div>
                    <div className="px-4 py-2.5 hover:bg-rose-50 cursor-pointer flex items-center gap-3 text-sm font-semibold text-rose-600 transition-colors">
                      <LogOut size={16} />
                      Logout
                    </div>
                  </motion.div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-y-auto p-[18px] custom-scrollbar">
          <div className="w-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};
