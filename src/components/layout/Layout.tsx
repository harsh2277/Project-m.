import React from 'react';
import {
  LayoutDashboard, FolderDot, CheckSquare, Calendar,
  Zap, Settings, Search, BarChart3,
  Bell, PanelLeftClose, PanelLeftOpen, User, LogOut, ChevronDown, Plus,
  Timer, FileText, Plug, Sun, Moon
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';

// Suppress unused import warning — BarChart3 kept for potential future use
void BarChart3;

const SidebarItem = ({ icon: Icon, label, active = false, badge, hasDropdown = false, isCollapsed = false, path, onPlusClick }: {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  badge?: string;
  hasDropdown?: boolean;
  isCollapsed?: boolean;
  path?: string;
  onPlusClick?: () => void;
}) => {
  const navigate = useNavigate();
  return (
    <div
      className={`flex items-center ${isCollapsed ? 'justify-center mx-2' : 'justify-between px-4'} py-2.5 rounded-xl cursor-pointer transition-all duration-200 ${
        active ? 'bg-primary/10 text-primary' : 'text-text-muted hover:bg-page hover:text-text-main'
      }`}
      title={isCollapsed ? label : undefined}
      onClick={() => path && navigate(path)}
    >
      <div className={`flex items-center ${isCollapsed ? '' : 'gap-3'}`}>
        <Icon
          size={20}
          className={active ? 'text-primary' : 'text-text-muted'}
        />
        {!isCollapsed && (
          <span className={`text-sm ${active ? 'font-bold' : 'font-semibold'}`}>
            {label}
          </span>
        )}
      </div>
      {!isCollapsed && badge && (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-page text-text-muted">
          {badge}
        </span>
      )}
      {!isCollapsed && hasDropdown && (
        <button
          onClick={(e) => { e.stopPropagation(); onPlusClick?.(); }}
          className="p-1 rounded-md transition-colors text-text-muted hover:text-primary hover:bg-white/10"
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
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { profile, user, signOut } = useAuth();

  /* Derived display values */
  const displayName =
    [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') ||
    user?.email?.split('@')[0] ||
    'User';
  const displayRole = profile?.job_title ?? 'Member';
  const avatarUrl = profile?.avatar_url
    ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=FBBF24&color=fff`;

  const handleSignOut = async () => {
    setIsProfileMenuOpen(false);
    // signOut() clears session state synchronously then invalidates the Supabase token
    await signOut();
    // Navigate AFTER state is cleared so PublicRoute sees session===null
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex h-screen overflow-hidden font-sans" style={{ backgroundColor: 'var(--bg-page)' }}>
      {/* Left Sidebar */}
      <aside
        className={`${isSidebarCollapsed ? 'w-20' : 'w-64'} transition-all duration-300 flex flex-col shrink-0 h-full`}
        style={{ backgroundColor: 'var(--bg-sidebar)', borderRight: '1px solid var(--border-subtle)' }}
      >
        {/* Logo */}
        <div className={`py-6 flex items-center ${isSidebarCollapsed ? 'flex-col gap-4 px-2 justify-center' : 'gap-2 px-6'}`}>
          <div className="p-1.5 rounded-lg shrink-0" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
            <Zap size={24} fill="currentColor" />
          </div>
          {!isSidebarCollapsed && (
            <span className="text-xl font-bold tracking-tight" style={{ color: 'var(--text-main)' }}>ProFlow</span>
          )}
        </div>

        {/* Nav Items */}
        <div className={`flex-1 overflow-y-auto ${isSidebarCollapsed ? 'px-2' : 'px-4'} space-y-8 pb-6`}>
          <div>
            <div className="space-y-1">
              <SidebarItem icon={LayoutDashboard} label="Dashboard" active={location.pathname === '/dashboard'} path="/dashboard" isCollapsed={isSidebarCollapsed} />
              <SidebarItem icon={FolderDot} label="Projects" active={location.pathname === '/projects'} path="/projects" isCollapsed={isSidebarCollapsed} />
              <SidebarItem icon={CheckSquare} label="Tasks" hasDropdown isCollapsed={isSidebarCollapsed} path="/tasks" active={location.pathname === '/tasks'} onPlusClick={() => window.dispatchEvent(new CustomEvent('openAddTask'))} />
              <SidebarItem icon={Calendar} label="Calendar" path="/calendar" active={location.pathname === '/calendar'} isCollapsed={isSidebarCollapsed} />
              <SidebarItem icon={Timer} label="Timer" path="/timer" active={location.pathname === '/timer'} isCollapsed={isSidebarCollapsed} />
              <SidebarItem icon={FileText} label="Timesheet" path="/timesheet" active={location.pathname === '/timesheet'} isCollapsed={isSidebarCollapsed} />
              <SidebarItem icon={Plug} label="Integrations" path="/integrations" active={location.pathname === '/integrations'} isCollapsed={isSidebarCollapsed} />
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="p-4 mt-auto" style={{ borderTop: '1px solid var(--border-subtle)' }}>
          {!isSidebarCollapsed && (
            <div
              className="rounded-2xl p-4 flex flex-col gap-1 mb-4 relative overflow-hidden group cursor-pointer transition-transform hover:-translate-y-0.5"
              style={{
                backgroundColor: 'var(--primary-light)',
                border: '1px solid var(--primary-muted)',
              }}
            >
              <div className="absolute top-0 right-0 p-4 opacity-10" style={{ color: 'var(--primary)' }}>
                <Zap size={48} className="transform rotate-12" />
              </div>
              <div className="flex items-center gap-2 font-bold z-10" style={{ color: 'var(--primary)' }}>
                <Zap size={16} fill="currentColor" /> Activate Premium
              </div>
              <p className="text-[11px] font-bold z-10 text-text-muted/60">Unlock all features on ProFlow</p>
            </div>
          )}

          {/* Theme Toggle */}
          <div
            onClick={toggleTheme}
            className={`flex items-center ${isSidebarCollapsed ? 'justify-center mx-2' : 'gap-3 px-4'} py-2 rounded-xl cursor-pointer transition-all mb-1`}
            style={{ color: 'var(--text-muted)' }}
            title={isSidebarCollapsed ? 'Toggle Theme' : undefined}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            {!isSidebarCollapsed && <span className="text-sm font-medium">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
          </div>

          {/* Settings */}
          <div
            onClick={() => navigate('/settings')}
            className={`flex items-center ${isSidebarCollapsed ? 'justify-center mx-2' : 'gap-3 px-4'} py-2 rounded-xl transition-all duration-200 cursor-pointer`}
            style={
              location.pathname === '/settings'
                ? { backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }
                : { color: 'var(--text-muted)' }
            }
            title={isSidebarCollapsed ? 'Menu Settings' : undefined}
          >
            <Settings size={20} style={{ color: location.pathname === '/settings' ? 'var(--primary)' : undefined }} />
            {!isSidebarCollapsed && <span className="text-sm font-medium">Menu Settings</span>}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden" style={{ backgroundColor: 'var(--bg-page)' }}>
        {/* Header */}
        <header
          className="p-[12px] flex items-center justify-between shrink-0"
          style={{ backgroundColor: 'var(--bg-sidebar)', borderBottom: '1px solid var(--border-subtle)' }}
        >
          <div className="flex items-center gap-5">
            <div
              className="p-2 rounded-xl cursor-pointer transition-colors shrink-0"
              style={{ border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-card)', color: 'var(--text-muted)' }}
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              title="Toggle Sidebar"
            >
              {isSidebarCollapsed ? <PanelLeftOpen size={20} strokeWidth={2} /> : <PanelLeftClose size={20} strokeWidth={2} />}
            </div>

            <div
              className="flex items-center px-4 py-2 rounded-xl w-96 transition-all"
              style={{ backgroundColor: 'var(--bg-page)', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}
            >
              <Search size={18} className="mr-2 opacity-50" />
              <input
                type="text"
                placeholder="Search insights..."
                className="bg-transparent outline-none text-sm font-medium w-full placeholder:font-normal appearance-none border-none shadow-none"
                style={{ color: 'var(--text-main)', background: 'transparent', border: 'none', boxShadow: 'none' }}
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Bell */}
            <button
              className="w-10 h-10 rounded-xl flex items-center justify-center relative transition-colors"
              style={{ backgroundColor: 'var(--bg-page)', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}
            >
              <div className="absolute top-2.5 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-black"></div>
              <Bell size={18} />
            </button>

            <div className="h-8 w-[1px]" style={{ backgroundColor: 'var(--border-subtle)' }}></div>

            {/* Profile */}
            <div className="relative">
              <div
                className="flex items-center gap-3 cursor-pointer p-1.5 rounded-xl transition-colors"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              >
                <div className="text-right hidden md:block">
                  <p className="text-sm font-bold leading-tight" style={{ color: 'var(--text-main)' }}>{displayName}</p>
                  <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{displayRole}</p>
                </div>
                <img src={avatarUrl} alt={displayName} className="w-10 h-10 rounded-xl" />
                <ChevronDown size={16} className={`text-slate-400 ml-1 transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
              </div>

              {isProfileMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsProfileMenuOpen(false)}></div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full right-0 mt-2 w-48 rounded-2xl shadow-xl z-50 py-2 overflow-hidden"
                    style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
                  >
                    <div
                      className="px-4 py-2.5 cursor-pointer flex items-center gap-3 text-sm font-semibold transition-colors hover:opacity-80"
                      style={{ color: 'var(--text-main)' }}
                      onClick={() => { setIsProfileMenuOpen(false); navigate('/settings'); }}
                    >
                      <User size={16} style={{ color: 'var(--text-muted)' }} />
                      Profile
                    </div>
                    <div className="h-px my-1" style={{ backgroundColor: 'var(--border-subtle)' }}></div>
                    <div
                      className="px-4 py-2.5 cursor-pointer flex items-center gap-3 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-50 dark:hover:bg-rose-950"
                      onClick={handleSignOut}
                    >
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
        <div className="flex-1 overflow-y-auto p-[18px]">
          <div className="w-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};
