import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '@/lib/store';
import { useShallow } from 'zustand/react/shallow';
import { AppLayout } from '@/components/layout/AppLayout';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Terminal, GitPullRequest } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CommentCard } from '@/components/github/CommentCard';
export function IssueDetailPage() {
  const { owner, repo, issue_number } = useParams<{ owner: string; repo: string; issue_number: string }>();
  const { issueDetails, isLoading, error, fetchIssueDetails } = useStore(
    useShallow((state) => ({
      issueDetails: state.issueDetails,
      isLoading: state.isLoading,
      error: state.error,
      fetchIssueDetails: state.fetchIssueDetails,
    }))
  );
  const detailKey = `${owner}/${repo}/${issue_number}`;
  const issue = issueDetails[detailKey];
  useEffect(() => {
    if (owner && repo && issue_number) {
      fetchIssueDetails(owner, repo, issue_number);
    }
  }, [owner, repo, issue_number, fetchIssueDetails]);
  const renderContent = () => {
    if (isLoading && !issue) {
      return (
        <div className="space-y-6">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Card><CardContent className="p-6"><Skeleton className="h-48 w-full" /></CardContent></Card>
        </div>
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
    if (!issue) {
      return <div className="text-center py-16">Issue not found.</div>;
    }
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-3xl font-bold font-display tracking-tight">
            {issue.title} <span className="text-muted-foreground">#{issue.number}</span>
          </h1>
          <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
            <Badge variant={issue.state === 'open' ? 'default' : 'destructive'} className={issue.state === 'open' ? 'bg-green-600' : ''}>
              <GitPullRequest className="h-3 w-3 mr-1" />
              {issue.state}
            </Badge>
            <span><b>{issue.user.login}</b> opened this issue {formatDistanceToNow(new Date(issue.created_at), { addSuffix: true })}</span>
            <span>·</span>
            <span>{issue.comments} comments</span>
          </div>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center gap-3 space-y-0 p-4 border-b">
              <img src={issue.user.avatar_url} alt={issue.user.login} className="h-8 w-8 rounded-full" />
              <span className="font-semibold">{issue.user.login}</span>
              <span className="text-muted-foreground text-sm">commented {formatDistanceToNow(new Date(issue.created_at), { addSuffix: true })}</span>
            </CardHeader>
            <CardContent className="p-6 prose dark:prose-invert max-w-none">
              {issue.body ? <ReactMarkdown remarkPlugins={[remarkGfm]}>{issue.body}</ReactMarkdown> : <p>No description provided.</p>}
            </CardContent>
          </Card>
          {issue.commentsList?.map((comment) => (
            <CommentCard key={comment.id} comment={comment} />
          ))}
        </div>
      </div>
    );
  };
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem><BreadcrumbLink asChild><Link to={`/user/${owner}`}>{owner}</Link></BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbLink asChild><Link to={`/repo/${owner}/${repo}`}>{repo}</Link></BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbLink asChild><Link to={`/repo/${owner}/${repo}`}>Issues</Link></BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbPage>{issue_number}</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          {renderContent()}
        </div>
      </div>
    </AppLayout>
  );
}