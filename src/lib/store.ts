import { create } from 'zustand';
import { GitHubRepo, GitHubFileContent, UserIdentity, UserSession, GitHubIssue, GitHubPullRequest, GitHubComment } from '@shared/types';
import { api } from './api-client';
interface AppState {
  repos: GitHubRepo[];
  repoDetails: Record<string, GitHubRepo>;
  fileContent: Record<string, GitHubFileContent[] | GitHubFileContent>;
  issues: GitHubIssue[];
  pullRequests: GitHubPullRequest[];
  issueDetails: Record<string, GitHubIssue>;
  userSession: UserIdentity | null;
  favorites: string[];
  recents: string[];
  isLoading: boolean;
  error: string | null;
  fetchRepos: (username: string) => Promise<void>;
  fetchRepoDetails: (owner: string, repo: string) => Promise<GitHubRepo | undefined>;
  fetchFileContent: (owner: string, repo: string, path: string) => Promise<void>;
  fetchIssues: (owner: string, repo: string) => Promise<void>;
  fetchPullRequests: (owner: string, repo: string) => Promise<void>;
  fetchIssueDetails: (owner: string, repo: string, issueNumber: string) => Promise<void>;
  fetchUserSession: () => Promise<void>;
  fetchUserSessionData: () => Promise<void>;
  toggleFavorite: (repoFullName: string) => Promise<void>;
  addRecentRepo: (repoFullName: string) => Promise<void>;
  clearError: () => void;
}
export const useStore = create<AppState>((set, get) => ({
  // Initial State
  repos: [],
  repoDetails: {},
  fileContent: {},
  issues: [],
  pullRequests: [],
  issueDetails: {},
  userSession: null,
  favorites: [],
  recents: [],
  isLoading: false,
  error: null,
  // Actions
  fetchRepos: async (username: string) => {
    set({ isLoading: true, error: null });
    try {
      const repos = await api<GitHubRepo[]>(`/api/github/users/${username}/repos`);
      set({ repos, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch repositories';
      set({ error: errorMessage, isLoading: false, repos: [] });
    }
  },
  fetchRepoDetails: async (owner: string, repo: string) => {
    const repoFullName = `${owner}/${repo}`;
    if (get().repoDetails[repoFullName]) return get().repoDetails[repoFullName];
    set({ isLoading: true, error: null });
    try {
      const details = await api<GitHubRepo>(`/api/github/repos/${owner}/${repo}`);
      set((state) => ({
        repoDetails: { ...state.repoDetails, [repoFullName]: details },
        isLoading: false,
      }));
      return details;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch repository details';
      set({ error: errorMessage, isLoading: false });
      return undefined;
    }
  },
  fetchFileContent: async (owner: string, repo: string, path: string = '') => {
    const contentKey = `${owner}/${repo}/${path}`;
    if (get().fileContent[contentKey]) return;
    set({ isLoading: true, error: null });
    try {
      const url = path ? `/api/github/repos/${owner}/${repo}/contents/${path}` : `/api/github/repos/${owner}/${repo}/contents`;
      const content = await api<GitHubFileContent[] | GitHubFileContent>(url);
      set((state) => ({
        fileContent: { ...state.fileContent, [contentKey]: content },
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch file content';
      set({ error: errorMessage, isLoading: false });
    }
  },
  fetchIssues: async (owner: string, repo: string) => {
    set({ isLoading: true, error: null, issues: [] });
    try {
      const issues = await api<GitHubIssue[]>(`/api/github/repos/${owner}/${repo}/issues`);
      set({ issues: issues.filter(issue => !issue.pull_request), isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch issues';
      set({ error: errorMessage, isLoading: false });
    }
  },
  fetchPullRequests: async (owner: string, repo: string) => {
    set({ isLoading: true, error: null, pullRequests: [] });
    try {
      const pullRequests = await api<GitHubPullRequest[]>(`/api/github/repos/${owner}/${repo}/pulls`);
      set({ pullRequests, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch pull requests';
      set({ error: errorMessage, isLoading: false });
    }
  },
  fetchIssueDetails: async (owner: string, repo: string, issueNumber: string) => {
    const detailKey = `${owner}/${repo}/${issueNumber}`;
    set({ isLoading: true, error: null });
    try {
      const issuePromise = api<GitHubIssue>(`/api/github/repos/${owner}/${repo}/issues/${issueNumber}`);
      const commentsPromise = api<GitHubComment[]>(`/api/github/repos/${owner}/${repo}/issues/${issueNumber}/comments`);
      const [issue, comments] = await Promise.all([issuePromise, commentsPromise]);
      set((state) => ({
        issueDetails: { ...state.issueDetails, [detailKey]: { ...issue, commentsList: comments } },
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch issue details';
      set({ error: errorMessage, isLoading: false });
    }
  },
  fetchUserSession: async () => {
    try {
      const session = await api<UserIdentity>('/api/session');
      set({ userSession: session });
      if (session) {
        get().fetchUserSessionData();
      }
    } catch (error) {
      set({ userSession: null, favorites: [], recents: [] });
    }
  },
  fetchUserSessionData: async () => {
    try {
      const sessionData = await api<UserSession>('/api/session/data');
      set({ favorites: sessionData.favorites, recents: sessionData.recents });
    } catch (error) {
      console.error("Failed to fetch user session data", error);
    }
  },
  toggleFavorite: async (repoFullName: string) => {
    try {
      const updatedSession = await api<UserSession>('/api/session/favorites', {
        method: 'POST',
        body: JSON.stringify({ repoFullName }),
      });
      set({ favorites: updatedSession.favorites });
    } catch (error) {
      console.error("Failed to toggle favorite", error);
    }
  },
  addRecentRepo: async (repoFullName: string) => {
    try {
      const updatedSession = await api<UserSession>('/api/session/recents', {
        method: 'POST',
        body: JSON.stringify({ repoFullName }),
      });
      set({ recents: updatedSession.recents });
    } catch (error) {
      console.error("Failed to add recent repo", error);
    }
  },
  clearError: () => set({ error: null }),
}));