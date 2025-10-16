import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '@/lib/store';
import { useShallow } from 'zustand/react/shallow';
import { AppLayout } from '@/components/layout/AppLayout';
import { FileViewer } from '@/components/github/FileViewer';
import { RepoStatsCard } from '@/components/github/RepoStatsCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Folder, File, Terminal } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { GitHubFileContent } from '@shared/types';
import { FavoriteButton } from '@/components/github/FavoriteButton';
import { IssueList } from '@/components/github/IssueList';
import { PullRequestList } from '@/components/github/PullRequestList';
function sortFiles(files: GitHubFileContent[]) {
  return [...files].sort((a, b) => {
    if (a.type === 'dir' && b.type !== 'dir') return -1;
    if (a.type !== 'dir' && b.type === 'dir') return 1;
    return a.name.localeCompare(b.name);
  });
}
export function RepoPage() {
  const { owner, repo } = useParams<{ owner: string; repo: string }>();
  const path = useParams()['*'] || '';
  const {
    fileContent,
    repoDetails,
    isLoading,
    error,
    fetchFileContent,
    fetchRepoDetails,
    userSession,
    addRecentRepo,
  } = useStore(
    useShallow((state) => ({
      fileContent: state.fileContent,
      repoDetails: state.repoDetails,
      isLoading: state.isLoading,
      error: state.error,
      fetchFileContent: state.fetchFileContent,
      fetchRepoDetails: state.fetchRepoDetails,
      userSession: state.userSession,
      addRecentRepo: state.addRecentRepo,
    }))
  );
  const [readmeContent, setReadmeContent] = useState<string | null>(null);
  const contentKey = `${owner}/${repo}/${path}`;
  const repoFullName = `${owner}/${repo}`;
  const currentContent = fileContent[contentKey];
  const currentRepoDetails = repoDetails[repoFullName];
  useEffect(() => {
    if (owner && repo) {
      fetchFileContent(owner, repo, path);
      if (!currentRepoDetails) {
        fetchRepoDetails(owner, repo);
      }
      if (userSession) {
        addRecentRepo(repoFullName);
      }
    }
  }, [owner, repo, path, fetchFileContent, fetchRepoDetails, currentRepoDetails, userSession, addRecentRepo, repoFullName]);
  useEffect(() => {
    const fetchReadme = async () => {
      if (Array.isArray(currentContent)) {
        const readmeFile = currentContent.find(file => file.name.toLowerCase() === 'readme.md');
        if (readmeFile && owner && repo) {
          const readmeKey = `${owner}/${repo}/${readmeFile.path}`;
          if (!fileContent[readmeKey]) {
            await fetchFileContent(owner, repo, readmeFile.path);
          }
        } else {
          setReadmeContent(null);
        }
      } else {
        setReadmeContent(null);
      }
    };
    if (Array.isArray(currentContent)) {
      const readmeFile = currentContent.find(file => file.name.toLowerCase() === 'readme.md');
      if (readmeFile && owner && repo) {
        const readmeKey = `${owner}/${repo}/${readmeFile.path}`;
        const readmeData = fileContent[readmeKey] as GitHubFileContent;
        if (readmeData && readmeData.content) {
          try {
            setReadmeContent(atob(readmeData.content));
          } catch (e) {
            console.error('Failed to decode README content:', e);
            setReadmeContent('Error: Could not display README. Invalid base64 content.');
          }
        } else if (!fileContent[readmeKey]) {
          fetchReadme();
        } else {
          setReadmeContent(null);
        }
      } else {
        setReadmeContent(null);
      }
    } else {
      setReadmeContent(null);
    }
  }, [currentContent, owner, repo, fetchFileContent, fileContent]);
  const pathSegments = path.split('/').filter(Boolean);
  const renderBreadcrumbs = () => (
    <div className="flex justify-between items-center mb-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild><Link to={`/user/${owner}`}>{owner}</Link></BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            {pathSegments.length > 0 ? (
              <BreadcrumbLink asChild><Link to={`/repo/${owner}/${repo}`}>{repo}</Link></BreadcrumbLink>
            ) : (
              <BreadcrumbPage>{repo}</BreadcrumbPage>
            )}
          </BreadcrumbItem>
          {pathSegments.map((segment, index) => (
            <React.Fragment key={segment}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {index === pathSegments.length - 1 ? (
                  <BreadcrumbPage>{segment}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild><Link to={`/repo/${owner}/${repo}/${pathSegments.slice(0, index + 1).join('/')}`}>{segment}</Link></BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
      <FavoriteButton repoFullName={repoFullName} />
    </div>
  );
  const renderFileBrowser = () => {
    if (!Array.isArray(currentContent)) return null;
    const sortedContent = sortFiles(currentContent);
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">{repo}</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-1">
            {sortedContent.map((item) => (
              <li key={item.sha}>
                <Link to={`/repo/${owner}/${repo}/${item.path}`} className="flex items-center gap-3 p-2 rounded-md hover:bg-accent transition-colors">
                  {item.type === 'dir' ? <Folder className="h-5 w-5 text-blue-500" /> : <File className="h-5 w-5 text-muted-foreground" />}
                  <span className="text-sm">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    );
  };
  const renderCodeContent = () => {
    if (isLoading && !currentContent) {
      return <Skeleton className="h-96 w-full" />;
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
    if (!currentContent) return null;
    const isFile = !Array.isArray(currentContent);
    return (
      <>
        {isFile ? (
          <FileViewer file={currentContent as GitHubFileContent} />
        ) : (
          <>
            {renderFileBrowser()}
            {readmeContent && (
              <Card className="mt-8">
                <CardHeader><CardTitle>README.md</CardTitle></CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{readmeContent}</ReactMarkdown>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </>
    );
  };
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          {renderBreadcrumbs()}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mt-6">
            <div className="lg:col-span-2 space-y-8">
              <Tabs defaultValue="code">
                <TabsList>
                  <TabsTrigger value="code">Code</TabsTrigger>
                  <TabsTrigger value="issues">Issues</TabsTrigger>
                  <TabsTrigger value="pulls">Pull Requests</TabsTrigger>
                </TabsList>
                <TabsContent value="code" className="mt-4">
                  {renderCodeContent()}
                </TabsContent>
                <TabsContent value="issues" className="mt-4">
                  <IssueList owner={owner!} repo={repo!} />
                </TabsContent>
                <TabsContent value="pulls" className="mt-4">
                  <PullRequestList owner={owner!} repo={repo!} />
                </TabsContent>
              </Tabs>
            </div>
            <div className="lg:col-span-1 sticky top-24">
              {currentRepoDetails ? (
                <RepoStatsCard repo={currentRepoDetails} />
              ) : (
                <Card>
                  <CardHeader><Skeleton className="h-6 w-24" /></CardHeader>
                  <CardContent className="space-y-4">
                    <Skeleton className="h-12 w-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-3/4" />
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}