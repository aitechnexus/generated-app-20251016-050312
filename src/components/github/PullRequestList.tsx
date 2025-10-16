import React, { useEffect } from 'react';
import { useStore } from '@/lib/store';
import { useShallow } from 'zustand/react/shallow';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { GitPullRequest, Terminal } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
interface PullRequestListProps {
  owner: string;
  repo: string;
}
export function PullRequestList({ owner, repo }: PullRequestListProps) {
  const { pullRequests, isLoading, error, fetchPullRequests } = useStore(
    useShallow((state) => ({
      pullRequests: state.pullRequests,
      isLoading: state.isLoading,
      error: state.error,
      fetchPullRequests: state.fetchPullRequests,
    }))
  );
  useEffect(() => {
    fetchPullRequests(owner, repo);
  }, [owner, repo, fetchPullRequests]);
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-5 w-5 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }
  if (error) {
    return (
      <Alert variant="destructive">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }
  if (pullRequests.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          No open pull requests found.
        </CardContent>
      </Card>
    );
  }
  return (
    <Card>
      <CardContent className="p-0">
        <ul className="divide-y">
          {pullRequests.map((pr) => (
            <li key={pr.id} className="p-4 hover:bg-accent transition-colors">
              <a href={pr.html_url} target="_blank" rel="noopener noreferrer" className="block">
                <div className="flex items-start gap-3">
                  <GitPullRequest className="h-5 w-5 mt-1 text-green-600" />
                  <div className="flex-1">
                    <p className="font-semibold leading-tight">{pr.title}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-muted-foreground">
                      <span>#{pr.number}</span>
                      <span>opened {formatDistanceToNow(new Date(pr.created_at), { addSuffix: true })}</span>
                      <span>by {pr.user.login}</span>
                    </div>
                  </div>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}