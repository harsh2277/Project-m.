import type { JiraConfig, JiraProject, JiraTask } from '../types/jira';

/**
 * Jira API client.
 *
 * In development (npm run dev):
 *   Requests go to the local Vite dev-server proxy at /jira-proxy/<path>.
 *   The proxy plugin in vite.config.ts forwards them server-to-server to Jira,
 *   so CORS never applies and the API token is not exposed in a third-party log.
 *
 * In production / custom setups:
 *   Set VITE_JIRA_PROXY_URL to a URL of an external proxy you control.
 *   Example: VITE_JIRA_PROXY_URL=https://your-proxy.com/jira-proxy
 */

const normalizeSiteUrl = (url: string): string => {
  let siteUrl = url.trim();
  if (!siteUrl.startsWith('http')) siteUrl = `https://${siteUrl}`;
  return siteUrl.endsWith('/') ? siteUrl.slice(0, -1) : siteUrl;
};

const getAuthHeader = (config: JiraConfig): string =>
  `Basic ${btoa(`${config.email.trim()}:${config.token.trim()}`)}`;

/**
 * Send a request through the local Vite proxy (/jira-proxy) or a configured external proxy.
 * The target Jira base URL is communicated via the X-Jira-Target header.
 */
async function jiraRequest<T>(
  config: JiraConfig,
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const siteUrl = normalizeSiteUrl(config.url);

  // Determine proxy base
  const externalProxy = import.meta.env.VITE_JIRA_PROXY_URL as string | undefined;
  const useExternalProxy = externalProxy && externalProxy.trim() !== '';

  let url: string;
  const extraHeaders: Record<string, string> = {};

  if (useExternalProxy) {
    // External proxy: forward the full URL as the path (cors-anywhere style)
    const base = externalProxy!.trim().replace(/\/$/, '');
    url = `${base}/${siteUrl}${path}`;
    extraHeaders['X-Requested-With'] = 'XMLHttpRequest';
  } else {
    // Local Vite dev-server proxy — server-to-server, no CORS issues
    url = `/jira-proxy${path}`;
    extraHeaders['X-Jira-Target'] = siteUrl;
  }

  const response = await fetch(url, {
    ...init,
    headers: {
      Authorization: getAuthHeader(config),
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...extraHeaders,
      ...(init.headers as Record<string, string> ?? {}),
    },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null) as {
      errorMessages?: string[];
      message?: string;
      error?: string;
    } | null;

    const message =
      body?.errorMessages?.[0] ??
      body?.message ??
      body?.error ??
      `Jira request failed with status ${response.status}`;

    // Provide a more helpful message for common status codes
    if (response.status === 401) {
      throw new Error('Jira authentication failed. Check your email and API token.');
    }
    if (response.status === 403) {
      throw new Error(
        'Access denied (403). Make sure your Jira API token has the correct permissions, ' +
        'and that the email matches the token owner.'
      );
    }
    if (response.status === 404) {
      throw new Error(
        'Jira resource not found (404). Check your Site URL — it should look like https://yourcompany.atlassian.net'
      );
    }

    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

/* ─── Public API ─────────────────────────────────────────────── */

export async function verifyJiraConnection(config: JiraConfig) {
  return jiraRequest<{ displayName: string; emailAddress?: string }>(
    config,
    '/rest/api/3/myself',
  );
}

export async function fetchJiraProjects(config: JiraConfig): Promise<JiraProject[]> {
  const data = await jiraRequest<{
    values?: Array<{
      id: string;
      key: string;
      name: string;
      projectTypeKey?: string;
      avatarUrls?: Record<string, string>;
    }>;
  }>(config, '/rest/api/3/project/search?maxResults=100&orderBy=name');

  return (data.values ?? []).map((project) => ({
    id: project.id,
    key: project.key,
    name: project.name,
    projectTypeKey: project.projectTypeKey,
    avatarUrl: project.avatarUrls?.['48x48'] ?? project.avatarUrls?.['32x32'],
  }));
}

const formatDate = (value?: string | null): string => {
  if (!value) return 'TBD';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }).format(new Date(value));
};

export async function fetchJiraTasksForProject(
  config: JiraConfig,
  project: JiraProject,
): Promise<JiraTask[]> {
  const data = await jiraRequest<{
    issues?: Array<{
      id: string;
      key: string;
      fields: {
        summary?: string;
        status?: { name?: string };
        priority?: { name?: string };
        assignee?: { displayName?: string };
        duedate?: string | null;
        updated?: string;
        issuetype?: { name?: string };
        description?: unknown;
      };
    }>;
  }>(config, '/rest/api/3/search/jql', {
    method: 'POST',
    body: JSON.stringify({
      jql: `project = ${project.key} ORDER BY updated DESC`,
      fields: ['summary', 'status', 'assignee', 'priority', 'duedate', 'updated', 'issuetype', 'description'],
      maxResults: 50,
    }),
  });

  return (data.issues ?? []).map((issue) => ({
    id: issue.id,
    key: issue.key,
    title: issue.fields.summary ?? issue.key,
    projectId: project.id,
    projectKey: project.key,
    projectName: project.name,
    status: issue.fields.status?.name ?? 'To Do',
    priority: issue.fields.priority?.name ?? 'Medium',
    assignee: issue.fields.assignee?.displayName ?? 'Unassigned',
    due: formatDate(issue.fields.duedate),
    updatedAt: issue.fields.updated ?? '',
    issueType: issue.fields.issuetype?.name ?? 'Task',
  }));
}

export async function fetchJiraTasksForProjects(
  config: JiraConfig,
  projects: JiraProject[],
): Promise<JiraTask[]> {
  const groups = await Promise.all(
    projects.map((project) => fetchJiraTasksForProject(config, project)),
  );
  return groups.flat();
}

export function getSavedJiraConfig(): JiraConfig | null {
  const raw = localStorage.getItem('jira_config');
  if (!raw) return null;
  try {
    return JSON.parse(raw) as JiraConfig;
  } catch {
    return null;
  }
}
