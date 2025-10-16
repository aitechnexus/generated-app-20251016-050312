import React, { useEffect } from 'react';
import { useStore } from '@/lib/store';
import { useShallow } from 'zustand/react/shallow';
import { RepoCard } from './RepoCard';
import { Skeleton } from '../ui/skeleton';
import { GitHubRepo } from '@shared/types';
export function RecentRepos() {
  const { recents, repoDetails, fetchRepoDetails } = useStore(
    useShallow((state) => ({
      recents: state.recents,
      repoDetails: state.repoDetails,
      fetchRepoDetails: state.fetchRepoDetails,
    }))
  );
  useEffect(() => {
    recents.forEach((fullName) => {
      if (!repoDetails[fullName]) {
        const [owner, repo] = fullName.split('/');
        fetchRepoDetails(owner, repo);
      }
    });
  }, [recents, repoDetails, fetchRepoDetails]);
  if (recents.length === 0) {
    return null;
  }
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold font-display tracking-tight">Recently Viewed</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recents.map((fullName) => {
          const repo = repoDetails[fullName];
          if (repo) {
            return <RepoCard key={repo.id} repo={repo} />;
          }
          return (
            <div key={fullName} className="flex flex-col space-y-3">
              <Skeleton className="h-[125px] w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}