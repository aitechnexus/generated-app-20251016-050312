import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Code, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useStore } from '@/lib/store';
import { useShallow } from 'zustand/react/shallow';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export function AppHeader() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { userSession, fetchUserSession } = useStore(
    useShallow((state) => ({
      userSession: state.userSession,
      fetchUserSession: state.fetchUserSession,
    }))
  );
  const [isSessionLoading, setIsSessionLoading] = useState(true);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/user/${searchTerm.trim()}`);
      setSearchTerm('');
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      await fetchUserSession();
      setIsSessionLoading(false);
    };
    checkSession();
  }, [fetchUserSession]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-1.5 rounded-lg bg-primary text-primary-foreground group-hover:scale-110 transition-transform duration-200">
              <Code size={24} />
            </div>
            <span className="text-xl font-bold font-display tracking-tight text-foreground group-hover:text-primary transition-colors">
              Codeflare
            </span>
          </Link>
          <div className="flex flex-1 items-center justify-end gap-4">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search users or orgs..."
                  className="w-full pl-10 md:w-64 lg:w-96"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </form>
            </div>
            <div className="flex items-center gap-2">
              {isSessionLoading ? (
                <Skeleton className="h-9 w-24" />
              ) : userSession ? (
                <>
                  <span className="text-sm text-muted-foreground hidden sm:inline">{userSession.email}</span>
                  <Button variant="outline" asChild>
                    <a href="/cdn-cgi/access/logout">Logout</a>
                  </Button>
                </>
              ) : (
                <Button asChild>
                  <a href="/">Cloudflare Login</a>
                </Button>
              )}
            </div>
            <ThemeToggle className="relative" />
          </div>
        </div>
      </div>
    </header>
  );
}