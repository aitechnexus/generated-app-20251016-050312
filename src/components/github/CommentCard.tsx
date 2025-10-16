import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { GitHubComment } from '@shared/types';
import { formatDistanceToNow } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
interface CommentCardProps {
  comment: GitHubComment;
}
export function CommentCard({ comment }: CommentCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-3 space-y-0 p-4 border-b bg-muted/50">
        <img src={comment.user.avatar_url} alt={comment.user.login} className="h-8 w-8 rounded-full" />
        <a href={comment.user.html_url} target="_blank" rel="noopener noreferrer" className="font-semibold hover:underline">{comment.user.login}</a>
        <span className="text-muted-foreground text-sm">
          commented {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
        </span>
      </CardHeader>
      <CardContent className="p-6 prose dark:prose-invert max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{comment.body}</ReactMarkdown>
      </CardContent>
    </Card>
  );
}