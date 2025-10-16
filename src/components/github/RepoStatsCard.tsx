import { GitHubRepo } from '@shared/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, Eye, GitFork, Code, Scale, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
interface RepoStatsCardProps {
  repo: GitHubRepo;
}
const languageColorMap: Record<string, string> = {
  TypeScript: 'bg-blue-500',
  JavaScript: 'bg-yellow-500',
  Python: 'bg-green-500',
  Java: 'bg-red-500',
  HTML: 'bg-orange-500',
  CSS: 'bg-purple-500',
  Go: 'bg-cyan-500',
  Rust: 'bg-amber-600',
  Shell: 'bg-lime-500',
};
const StatItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | number | null }) => (
  <div className="flex items-center justify-between text-sm">
    <div className="flex items-center gap-2 text-muted-foreground">
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </div>
    <span className="font-medium text-foreground">{value ?? 'N/A'}</span>
  </div>
);
export function RepoStatsCard({ repo }: RepoStatsCardProps) {
  const languageColor = repo.language ? languageColorMap[repo.language] || 'bg-gray-500' : 'bg-gray-500';
  return (
    <Card>
      <CardHeader>
        <CardTitle>About</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <CardDescription>{repo.description || 'No description provided.'}</CardDescription>
        <div className="space-y-3 pt-2 border-t">
          <StatItem icon={Star} label="Stars" value={repo.stargazers_count.toLocaleString()} />
          <StatItem icon={Eye} label="Watching" value={repo.watchers_count.toLocaleString()} />
          <StatItem icon={GitFork} label="Forks" value={repo.forks_count.toLocaleString()} />
          {repo.language && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Code className="h-4 w-4" />
                <span>Language</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={cn('h-2 w-2 rounded-full', languageColor)} />
                <span className="font-medium text-foreground">{repo.language}</span>
              </div>
            </div>
          )}
          <StatItem icon={Scale} label="License" value={repo.license?.name ?? 'No license'} />
          <StatItem icon={Calendar} label="Updated" value={formatDistanceToNow(new Date(repo.updated_at), { addSuffix: true })} />
        </div>
      </CardContent>
    </Card>
  );
}