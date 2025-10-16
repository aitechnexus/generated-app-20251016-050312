import React, { useEffect } from 'react';
import { useStore } from '@/lib/store';
import { useShallow } from 'zustand/react/shallow';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { GitPullRequest, MessageSquare, Terminal } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
interface IssueListProps {
  owner: string;
  repo: string;
}
export function IssueList({ owner, repo }: IssueListProps) {
  const { issues, isLoading, error, fetchIssues } = useStore(
    useShallow((state) => ({
      issues: state.issues,
      isLoading: state.isLoading,
      error: state.error,
      fetchIssues: state.fetchIssues,
    }))
  );
  useEffect(() => {
    fetchIssues(owner, repo);
  }, [owner, repo, fetchIssues]);
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
  if (issues.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          No open issues found.
        </CardContent>
      </Card>
    );
  }
  return (
    <Card>
      <CardContent className="p-0">
        <ul className="divide-y">
          {issues.map((issue) => (
            <li key={issue.id} className="p-4 hover:bg-accent transition-colors">
              <Link to={`/repo/${owner}/${repo}/issues/${issue.number}`} className="block">
                <div className="flex items-start gap-3">
                  <GitPullRequest className="h-5 w-5 mt-1 text-green-600" />
                  <div className="flex-1">
                    <p className="font-semibold leading-tight">{issue.title}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-muted-foreground">
                      <span>#{issue.number}</span>
                      <span>opened {formatDistanceToNow(new Date(issue.created_at), { addSuffix: true })}</span>
                      <span>by {issue.user.login}</span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {issue.labels.map((label) => (
                        <Badge key={label.id} variant="outline" style={{ borderColor: `#${label.color}`, color: `#${label.color}` }}>
                          {label.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  {issue.comments > 0 && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MessageSquare className="h-4 w-4" />
                      <span>{issue.comments}</span>
                    </div>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}