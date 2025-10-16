import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { GitBranch, Star } from 'lucide-react';
import { GitHubRepo } from '@shared/types';
import { cn } from '@/lib/utils';
interface RepoCardProps {
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
export function RepoCard({ repo }: RepoCardProps) {
  const languageColor = repo.language ? languageColorMap[repo.language] || 'bg-gray-500' : 'bg-gray-500';
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="h-full"
    >
      <Link to={`/repo/${repo.owner.login}/${repo.name}`} className="block h-full">
        <Card className="flex flex-col h-full transition-all duration-200 hover:shadow-lg hover:border-primary/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <GitBranch className="h-5 w-5 text-primary" />
              <span className="truncate">{repo.name}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow pt-0">
            <CardDescription className="line-clamp-2">
              {repo.description || 'No description provided.'}
            </CardDescription>
          </CardContent>
          <CardFooter className="flex justify-between items-center text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4" />
                <span>{repo.stargazers_count}</span>
              </div>
              {repo.language && (
                <div className="flex items-center gap-2">
                  <span className={cn('h-3 w-3 rounded-full', languageColor)} />
                  <span>{repo.language}</span>
                </div>
              )}
            </div>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
}