export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
// Minimal real-world chat example types (shared by frontend and worker) - from template
export interface User {
  id: string;
  name: string;
}
export interface Chat {
  id: string;
  title: string;
}
export interface ChatMessage {
  id: string;
  chatId: string;
  userId: string;
  text: string;
  ts: number; // epoch millis
}
export interface UserIdentity {
  email: string;
}
export interface UserSession {
  email: string;
  favorites: string[]; // array of "owner/repo"
  recents: string[]; // array of "owner/repo"
}
// GitHub API Types for Codeflare
export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name?: string | null;
}
export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  owner: GitHubUser;
  html_url: string;
  description: string | null;
  fork: boolean;
  url: string;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  language: string | null;
  license: {
    name: string;
  } | null;
  updated_at: string;
}
export interface GitHubFileContent {
  name: string;
  path: string;
  sha: string;
  size: number;
  type: 'file' | 'dir';
  content?: string; // base64 encoded
  encoding?: 'base64';
  download_url: string | null;
}
export interface GitHubLabel {
  id: number;
  name: string;
  color: string;
  description: string | null;
}
export interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  user: GitHubUser;
  labels: GitHubLabel[];
  state: 'open' | 'closed';
  comments: number;
  created_at: string;
  updated_at: string;
  body: string | null;
  html_url: string;
  pull_request?: object;
  commentsList?: GitHubComment[];
}
export interface GitHubPullRequest {
  id: number;
  number: number;
  title: string;
  user: GitHubUser;
  state: 'open' | 'closed' | 'merged';
  created_at: string;
  updated_at: string;
  html_url: string;
}
export interface GitHubComment {
  id: number;
  user: GitHubUser;
  created_at: string;
  updated_at: string;
  body: string;
  html_url: string;
}