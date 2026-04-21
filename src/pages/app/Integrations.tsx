import React, { useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import {
  Plus, Search, ExternalLink, Check,
  Settings2, Shield, Zap, Globe,
  Calendar, MessageSquare, Trello,
  LayoutGrid, MessageCircle, Bug,
  X, Trash2, Send, Link, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  fetchJiraProjects,
  fetchJiraTasksForProjects,
  verifyJiraConnection,
} from '../../lib/jira';
import type { JiraConfig, JiraProject } from '../../types/jira';
import { JIRA_STORAGE_KEYS } from '../../types/jira';

const INITIAL_APPS = [
  {
    id: 'google-calendar',
    name: 'Google Calendar',
    description: 'Sync your project deadlines and meetings directly with Google Calendar.',
    icon: Calendar,
    color: 'text-blue-500',
    bg: 'bg-primary/10',
    status: 'connected',
    category: 'Productivity'
  },
  {
    id: 'zoho-cliq',
    name: 'Zoho Cliq',
    description: 'Get real-time project updates and notifications in your Zoho Cliq channels.',
    icon: MessageSquare,
    color: 'text-orange-500',
    bg: 'bg-orange-50',
    status: 'disconnected',
    category: 'Communication',
    webhookUrl: ''
  },
  {
    id: 'jira',
    name: 'Jira',
    description: 'Import Jira issues as tasks and keep status synced across both platforms.',
    icon: Bug,
    color: 'text-primary',
    bg: 'bg-primary/10',
    status: 'disconnected',
    category: 'Management',
  }
];

/* ─── Components ─────────────────────────────────────────────── */

const WebhookModal = ({ isOpen, onClose, onSave, app }: any) => {
  const [url, setUrl] = useState(app.webhookUrl || '');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      />
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-card rounded-[32px] w-full max-w-lg overflow-hidden shadow-2xl relative z-10 border border-border"
      >
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-black text-text-main">Integrate Zoho Cliq</h2>
            <button onClick={onClose} className="p-2 hover:bg-page rounded-full text-text-muted"><X size={20} /></button>
          </div>

          <div className="space-y-6">
            <div className="p-4 bg-orange-500/10 rounded-2xl flex gap-4 border border-orange-500/20">
              <div className="w-10 h-10 rounded-xl bg-card flex items-center justify-center text-orange-500 shrink-0">
                <Link size={20} />
              </div>
              <p className="text-sm text-orange-800 font-medium">
                To integrate, create a Webhook in your Zoho Cliq administration panel and paste the URL below.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-text-muted uppercase tracking-widest ml-1">Webhook URL</label>
              <input
                type="text"
                placeholder="https://cliq.zoho.com/api/v2/channelsbyname/..."
                className="w-full bg-page border border-border rounded-2xl px-5 py-4 text-sm font-medium outline-none focus:border-orange-300 transition-all font-sans text-text-main"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>

            <button
              onClick={() => onSave(url)}
              disabled={!url}
              className="w-full py-4 bg-orange-500 text-white rounded-2xl font-black text-sm hover:bg-orange-600 transition-all shadow-lg shadow-orange-200 disabled:opacity-50 disabled:shadow-none"
            >
              Verify & Integrate
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

const JiraModal = ({ isOpen, onClose, onSave, app }: any) => {
  const [data, setData] = useState({
    url: app.jiraUrl || '',
    email: app.jiraEmail || '',
    token: app.jiraToken || ''
  });
  const [isValidating, setIsValidating] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<JiraProject[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [connectedUser, setConnectedUser] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleVerify = async () => {
    setIsValidating(true);
    setError(null);
    setProjects([]);
    setSelectedKeys([]);
    setConnectedUser(null);

    try {
      let siteUrl = data.url.trim();
      if (!siteUrl.startsWith('http')) siteUrl = `https://${siteUrl}`;
      if (siteUrl.endsWith('/')) siteUrl = siteUrl.slice(0, -1);

      const config: JiraConfig = {
        url: siteUrl,
        email: data.email.trim(),
        token: data.token.trim(),
      };

      const [me, fetchedProjects] = await Promise.all([
        verifyJiraConnection(config),
        fetchJiraProjects(config),
      ]);

      setData(config);
      setConnectedUser(me.displayName);
      setProjects(fetchedProjects);
      setSelectedKeys(fetchedProjects.slice(0, 5).map(project => project.key));

      if (fetchedProjects.length === 0) {
        setError('Connection verified, but no Jira projects were visible for this account.');
      }
    } catch (err) {
      setError(err instanceof Error
        ? err.message
        : 'Unable to connect to Jira. Check your site URL, email, and API token.');
    } finally {
      setIsValidating(false);
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    setError(null);

    try {
      const selectedProjects = projects.filter(project => selectedKeys.includes(project.key));
      if (selectedProjects.length === 0) {
        setError('Select at least one Jira project to sync.');
        return;
      }

      const tasks = await fetchJiraTasksForProjects(data, selectedProjects);
      onSave({
        ...data,
        status: 'connected',
        projects: selectedProjects,
        tasks,
        selectedProjectKeys: selectedProjects.map(project => project.key),
      });
    } catch (err) {
      setError(err instanceof Error
        ? err.message
        : 'Connected to Jira, but task sync failed.');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
      <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} className="bg-card rounded-[32px] w-full max-w-lg overflow-hidden shadow-2xl relative z-10" >
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-black text-text-main">Setup Jira Sync</h2>
            <button onClick={onClose} className="p-2 hover:bg-page rounded-full text-text-muted"><X size={20} /></button>
          </div>

          <div className="space-y-5">
            <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20 flex items-start gap-4">
              <div className="p-2 bg-card rounded-xl text-primary shadow-sm shrink-0">
                <AlertCircle size={20} />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-blue-900">How to get your API Token?</p>
                <p className="text-[12px] font-medium text-primary leading-relaxed">
                  Go to <a href="https://id.atlassian.com/manage-profile/security/api-tokens" target="_blank" rel="noreferrer" className="underline font-black hover:text-blue-900 transition-colors">Security Settings</a>, click "Create API token", and copy it here.
                </p>
              </div>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-xs font-bold flex items-center gap-3">
                <X className="shrink-0" size={16} />
                {error}
              </motion.div>
            )}

            {connectedUser && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-600 text-xs font-bold">
                Connected as {connectedUser}. Select Jira projects to import.
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-black text-text-muted uppercase tracking-widest ml-1">Jira Site URL</label>
              <input
                type="text"
                placeholder="https://your-domain.atlassian.net"
                className="w-full bg-page border border-border rounded-2xl px-5 py-3.5 text-sm font-medium outline-none focus:border-primary transition-all text-text-main"
                value={data.url}
                onChange={(e) => setData({ ...data, url: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-text-muted uppercase tracking-widest ml-1">Atlassian Email</label>
              <input
                type="email"
                placeholder="name@company.com"
                className="w-full bg-page border border-border rounded-2xl px-5 py-3.5 text-sm font-medium outline-none focus:border-primary transition-all text-text-main"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-text-muted uppercase tracking-widest ml-1">API Token</label>
              <input
                type="password"
                placeholder="••••••••••••••••"
                className="w-full bg-page border border-border rounded-2xl px-5 py-3.5 text-sm font-medium outline-none focus:border-primary transition-all text-text-main"
                value={data.token}
                onChange={(e) => setData({ ...data, token: e.target.value })}
              />
            </div>

            <button
              onClick={handleVerify}
              disabled={isValidating || !data.url || !data.email || !data.token}
              className="w-full py-4 bg-primary text-white rounded-2xl font-black text-sm hover:bg-primary-hover transition-all shadow-lg shadow-primary-light disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isValidating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify & Connect"
              )}
            </button>

            {projects.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-black text-text-muted uppercase tracking-widest ml-1">Projects to Sync</p>
                  <button
                    type="button"
                    onClick={() => setSelectedKeys(selectedKeys.length === projects.length ? [] : projects.map(project => project.key))}
                    className="text-[11px] font-black text-primary hover:underline"
                  >
                    {selectedKeys.length === projects.length ? 'Clear All' : 'Select All'}
                  </button>
                </div>
                <div className="max-h-52 overflow-y-auto rounded-2xl border border-border bg-page p-2 space-y-1">
                  {projects.map(project => {
                    const selected = selectedKeys.includes(project.key);
                    return (
                      <button
                        key={project.id}
                        type="button"
                        onClick={() => setSelectedKeys(prev => selected ? prev.filter(key => key !== project.key) : [...prev, project.key])}
                        className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${selected ? 'bg-primary/10 text-primary' : 'hover:bg-card text-text-main'}`}
                      >
                        <span>
                          <span className="block text-sm font-black">{project.name}</span>
                          <span className="block text-[11px] font-bold text-text-muted">{project.key}</span>
                        </span>
                        {selected && <Check size={16} />}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={handleSync}
                  disabled={isSyncing || selectedKeys.length === 0}
                  className="w-full py-4 bg-primary text-white rounded-2xl font-black text-sm hover:bg-primary-hover transition-all shadow-lg shadow-primary-light disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSyncing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Fetching projects & tasks...
                    </>
                  ) : (
                    `Sync ${selectedKeys.length} Project${selectedKeys.length === 1 ? '' : 's'}`
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

const IntegrationCard = ({ app, onUpdate }: any) => {
  const [loading, setLoading] = useState(false);
  const [showWebhookModal, setShowWebhookModal] = useState(false);
  const [showJiraModal, setShowJiraModal] = useState(false);
  const isConnected = app.status === 'connected';

  const handleConnect = () => {
    if (app.id === 'zoho-cliq') {
      setShowWebhookModal(true);
    } else if (app.id === 'jira') {
      setShowJiraModal(true);
    } else {
      setLoading(true);
      setTimeout(() => {
        onUpdate(app.id, { status: 'connected' });
        setLoading(false);
      }, 1500);
    }
  };

  const handleDelete = () => {
    onUpdate(app.id, { status: 'disconnected', webhookUrl: '', jiraUrl: '', jiraEmail: '', jiraToken: '' });
    if (app.id === 'jira') {
      localStorage.removeItem(JIRA_STORAGE_KEYS.connected);
      localStorage.removeItem(JIRA_STORAGE_KEYS.config);
      localStorage.removeItem(JIRA_STORAGE_KEYS.projects);
      localStorage.removeItem(JIRA_STORAGE_KEYS.tasks);
      localStorage.removeItem(JIRA_STORAGE_KEYS.selectedProjectKeys);
      window.dispatchEvent(new Event('storage'));
    }
  };

  const handleTest = async () => {
    setLoading(true);
    try {
      if (app.id === 'jira') {
        const rawConfig = localStorage.getItem(JIRA_STORAGE_KEYS.config);
        const rawProjects = localStorage.getItem(JIRA_STORAGE_KEYS.projects);
        if (!rawConfig || !rawProjects) throw new Error('Connect Jira and select projects first.');

        const config = JSON.parse(rawConfig) as JiraConfig;
        const projects = JSON.parse(rawProjects) as JiraProject[];
        const tasks = await fetchJiraTasksForProjects(config, projects);
        localStorage.setItem(JIRA_STORAGE_KEYS.tasks, JSON.stringify(tasks));
        window.dispatchEvent(new Event('storage'));
        alert(`Synced ${projects.length} Jira project${projects.length === 1 ? '' : 's'} and ${tasks.length} task${tasks.length === 1 ? '' : 's'}.`);
      } else {
        await new Promise(r => setTimeout(r, 1000));
        alert('Test message sent to Zoho Cliq!');
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Sync failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        whileHover={{ y: -4 }}
        className="bg-card p-6 rounded-[24px] border border-border shadow-sm hover:shadow-md transition-all flex flex-col h-full group"
      >
        <div className="flex justify-between items-start mb-6">
          <div className={`w-14 h-14 rounded-2xl ${app.bg} flex items-center justify-center transition-transform group-hover:scale-110`}>
            <app.icon className={app.color} size={30} />
          </div>
          <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${isConnected ? 'bg-emerald-500/10 text-emerald-600' : 'bg-page text-text-muted'}`}>
            {isConnected ? 'Connected' : 'Not Linked'}
          </div>
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-bold text-text-main mb-2">{app.name}</h3>
          <p className="text-sm text-text-muted font-medium leading-relaxed">
            {app.description}
          </p>
          {isConnected && (app.webhookUrl || app.jiraUrl) && (
            <div className="mt-4 p-3 bg-page rounded-xl flex items-center gap-2 border border-border">
              <Link size={14} className="text-text-muted" />
              <span className="text-[11px] font-medium text-text-muted truncate">{app.webhookUrl || app.jiraUrl}</span>
            </div>
          )}
        </div>

        <div className="mt-8 flex items-center gap-3">
          {isConnected ? (
            <>
              {app.id === 'zoho-cliq' || app.id === 'jira' ? (
                <div className="flex w-full gap-2">
                  <button
                    onClick={() => app.id === 'zoho-cliq' ? setShowWebhookModal(true) : setShowJiraModal(true)}
                    className="flex-1 py-2.5 px-3 bg-page text-text-main rounded-xl text-xs font-black hover:bg-border transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Settings2 size={14} /> EDIT
                  </button>
                  <button
                    onClick={handleDelete}
                    className="p-2.5 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors border border-transparent hover:border-rose-100"
                  >
                    <Trash2 size={16} />
                  </button>
                  <button
                    onClick={handleTest}
                    disabled={loading}
                    className="flex-1 py-2.5 px-3 bg-primary text-white rounded-xl text-xs font-black hover:bg-primary-hover transition-all flex items-center justify-center gap-1.5 shadow-sm shadow-primary-light"
                  >
                    {loading ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Send size={14} /> {app.id === 'jira' ? 'SYNC' : 'TEST'}</>}
                  </button>
                </div>
              ) : (
                <>
                  <button className="flex-1 py-2.5 px-4 bg-page text-text-main rounded-xl text-sm font-bold hover:bg-border transition-colors flex items-center justify-center gap-2">
                    <Settings2 size={16} /> Configure
                  </button>
                  <button onClick={handleDelete} className="p-2.5 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors">
                    <Trash2 size={18} />
                  </button>
                </>
              )}
            </>
          ) : (
            <button
              onClick={handleConnect}
              disabled={loading}
              className="flex-1 py-2.5 px-4 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary-hover transition-all flex items-center justify-center gap-2 shadow-sm shadow-primary-light"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Connect <Plus size={16} /></>
              )}
            </button>
          )}
        </div>
      </motion.div>

      <WebhookModal isOpen={showWebhookModal} onClose={() => setShowWebhookModal(false)} app={app} onSave={(url: string) => { onUpdate(app.id, { status: 'connected', webhookUrl: url }); setShowWebhookModal(false); }} />
      <JiraModal
        isOpen={showJiraModal}
        onClose={() => setShowJiraModal(false)}
        app={app}
        onSave={(data: any) => {
          onUpdate(app.id, { status: 'connected', ...data });
          setShowJiraModal(false);
          localStorage.setItem(JIRA_STORAGE_KEYS.connected, 'true');
          localStorage.setItem(JIRA_STORAGE_KEYS.config, JSON.stringify({
            url: data.url,
            email: data.email,
            token: data.token
          }));
          localStorage.setItem(JIRA_STORAGE_KEYS.projects, JSON.stringify(data.projects ?? []));
          localStorage.setItem(JIRA_STORAGE_KEYS.tasks, JSON.stringify(data.tasks ?? []));
          localStorage.setItem(JIRA_STORAGE_KEYS.selectedProjectKeys, JSON.stringify(data.selectedProjectKeys ?? []));
          window.dispatchEvent(new Event('storage'));
        }}
      />
    </>
  );
};

/* ─── Main Page ─────────────────────────────────────────────── */

const Integrations: React.FC = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
  const [apps, setApps] = useState(() => {
    const rawConfig = localStorage.getItem(JIRA_STORAGE_KEYS.config);
    const jiraConnected = localStorage.getItem(JIRA_STORAGE_KEYS.connected) === 'true';
    const jiraConfig = rawConfig ? JSON.parse(rawConfig) : null;
    return INITIAL_APPS.map(app => app.id === 'jira' && jiraConnected
      ? {
          ...app,
          status: 'connected',
          jiraUrl: jiraConfig?.url ?? '',
          jiraEmail: jiraConfig?.email ?? '',
          jiraToken: jiraConfig?.token ?? '',
        }
      : app);
  });

  const updateApp = (id: string, updates: any) => {
    setApps(prev => prev.map(app => app.id === id ? { ...app, ...updates } : app));
  };

  const filtered = apps.filter(app => {
    const matchesTab = activeTab === 'All' || app.category === activeTab;
    const matchesSearch = app.name.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <Layout>
      <div className="max-w-[1280px] mx-auto space-y-10 pb-12 font-sans px-4">

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-4">
          <div className="space-y-1">
            <h1 className="text-[32px] font-extrabold text-text-main tracking-tight">Integrations</h1>
            <p className="text-text-muted font-medium flex items-center gap-2">
              Connect your favorite tools to automate your workflow <Zap size={16} className="text-amber-500 fill-amber-500" />
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center bg-card border border-border rounded-2xl px-5 py-3 shadow-sm text-sm font-medium text-text-muted w-full md:w-80 focus-within:border-primary/30 transition-all font-sans">
              <Search size={18} className="mr-3 text-text-muted opacity-50" />
              <input
                type="text"
                placeholder="Find an integration..."
                className="bg-transparent outline-none w-full text-text-main"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ background: 'transparent' }}
              />
            </div>
          </div>
        </div>

        {/* Apps Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode='popLayout'>
            {filtered.map(app => (
              <IntegrationCard key={app.id} app={app} onUpdate={updateApp} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Integrations;
