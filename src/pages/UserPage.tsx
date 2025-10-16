import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useStore } from '@/lib/store';
import { useShallow } from 'zustand/react/shallow';
import { AppLayout } from '@/components/layout/AppLayout';
import { RepoCard } from '@/components/github/RepoCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
export function UserPage() {
  const { username } = useParams<{ username: string }>();
  const { repos, isLoading, error, fetchRepos } = useStore(
    useShallow((state) => ({
      repos: state.repos,
      isLoading: state.isLoading,
      error: state.error,
      fetchRepos: state.fetchRepos,
    }))
  );
  useEffect(() => {
    if (username) {
      fetchRepos(username);
    }
  }, [username, fetchRepos]);
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="flex flex-col space-y-3">
              <Skeleton className="h-[125px] w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
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
    if (!repos || repos.length === 0) {
      return (
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold">No Repositories Found</h2>
          <p className="text-muted-foreground mt-2">
            This user doesn't have any public repositories or the user does not exist.
          </p>
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {repos.map((repo) => (
          <RepoCard key={repo.id} repo={repo} />
        ))}
      </div>
    );
  };
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold font-display tracking-tight">
              Repositories for <span className="text-primary">{username}</span>
            </h1>
            <p className="mt-2 text-muted-foreground">
              Browse public repositories for this user or organization.
            </p>
          </div>
          {renderContent()}
        </div>
      </div>
    </AppLayout>
  );
}