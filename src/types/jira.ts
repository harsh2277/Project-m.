export interface JiraConfig {
  url: string;
  email: string;
  token: string;
}

export interface JiraProject {
  id: string;
  key: string;
  name: string;
  projectTypeKey?: string;
  avatarUrl?: string;
}

export interface JiraTask {
  id: string;
  key: string;
  title: string;
  projectId: string;
  projectKey: string;
  projectName: string;
  status: string;
  priority: string;
  assignee: string;
  due: string;
  updatedAt: string;
  issueType: string;
  description?: string;
}

export const JIRA_STORAGE_KEYS = {
  connected: 'jira_connected',
  config: 'jira_config',
  projects: 'jira_projects',
  tasks: 'jira_tasks',
  selectedProjectKeys: 'jira_selected_project_keys',
} as const;
