import { Hono } from "hono";
import type { Context } from "hono";
import type { Env } from './core-utils';
import { UserIdentity, authMiddleware } from './auth';
import { ok, bad } from './core-utils';
import { UserSessionEntity } from "./entities";
const GITHUB_API_BASE = 'https://api.github.com';
export function userRoutes(app: Hono<{ Bindings: Env; Variables: { user: UserIdentity } }>) {
  // Authenticated Routes
  const privateRoutes = new Hono<{ Bindings: Env; Variables: { user: UserIdentity } }>();
  privateRoutes.use('*', authMiddleware);
  privateRoutes.get('/api/session', (c) => {
    const user = c.get('user');
    return ok(c, user);
  });
  privateRoutes.get('/api/session/data', async (c) => {
    const user = c.get('user');
    const sessionEntity = new UserSessionEntity(c.env, user.email);
    const session = await sessionEntity.getState();
    return ok(c, { ...session, email: user.email });
  });
  privateRoutes.post('/api/session/favorites', async (c) => {
    const user = c.get('user');
    const { repoFullName } = await c.req.json<{ repoFullName: string }>();
    if (!repoFullName) return bad(c, 'repoFullName is required');
    const sessionEntity = new UserSessionEntity(c.env, user.email);
    const updatedSession = await sessionEntity.toggleFavorite(repoFullName);
    return ok(c, updatedSession);
  });
  privateRoutes.post('/api/session/recents', async (c) => {
    const user = c.get('user');
    const { repoFullName } = await c.req.json<{ repoFullName: string }>();
    if (!repoFullName) return bad(c, 'repoFullName is required');
    const sessionEntity = new UserSessionEntity(c.env, user.email);
    const updatedSession = await sessionEntity.addRecent(repoFullName);
    return ok(c, updatedSession);
  });
  app.route('/', privateRoutes);
  // Public GitHub Proxy Routes
  const publicGitHubRoutes = new Hono<{ Bindings: Env }>();
  async function githubProxy(c: Context<{ Bindings: Env }>, path: string) {
    const url = `${GITHUB_API_BASE}${path}`;
    const headers = new Headers({
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Codeflare-App',
    });
    const authHeader = c.req.header('Authorization');
    if (authHeader) {
      headers.set('Authorization', authHeader);
    }
    try {
      const response = await fetch(url, { headers });
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`GitHub API error for ${url}: ${response.status} ${errorText}`);
        return c.json({ success: false, error: `GitHub API Error: ${response.statusText}` }, response.status as any);
      }
      const data = await response.json();
      return ok(c, data);
    } catch (error) {
      console.error(`Failed to fetch from GitHub API: ${error}`);
      return c.json({ success: false, error: 'Failed to contact GitHub API' }, 500);
    }
  }
  publicGitHubRoutes.get('/users/:username/repos', (c) => {
    const username = c.req.param('username');
    const page = c.req.query('page') || '1';
    const per_page = c.req.query('per_page') || '30';
    return githubProxy(c, `/users/${username}/repos?page=${page}&per_page=${per_page}&sort=updated`);
  });
  publicGitHubRoutes.get('/repos/:owner/:repo', (c) => {
    const { owner, repo } = c.req.param();
    return githubProxy(c, `/repos/${owner}/${repo}`);
  });
  publicGitHubRoutes.get('/repos/:owner/:repo/contents/:path{.+}', (c) => {
    const { owner, repo, path } = c.req.param();
    return githubProxy(c, `/repos/${owner}/${repo}/contents/${path}`);
  });
  publicGitHubRoutes.get('/repos/:owner/:repo/contents', (c) => {
    const { owner, repo } = c.req.param();
    return githubProxy(c, `/repos/${owner}/${repo}/contents`);
  });
  publicGitHubRoutes.get('/repos/:owner/:repo/issues', (c) => {
    const { owner, repo } = c.req.param();
    return githubProxy(c, `/repos/${owner}/${repo}/issues`);
  });
  publicGitHubRoutes.get('/repos/:owner/:repo/pulls', (c) => {
    const { owner, repo } = c.req.param();
    return githubProxy(c, `/repos/${owner}/${repo}/pulls`);
  });
  publicGitHubRoutes.get('/repos/:owner/:repo/issues/:issue_number', (c) => {
    const { owner, repo, issue_number } = c.req.param();
    return githubProxy(c, `/repos/${owner}/${repo}/issues/${issue_number}`);
  });
  publicGitHubRoutes.get('/repos/:owner/:repo/issues/:issue_number/comments', (c) => {
    const { owner, repo, issue_number } = c.req.param();
    return githubProxy(c, `/repos/${owner}/${repo}/issues/${issue_number}/comments`);
  });
  app.route('/api/github', publicGitHubRoutes);
}