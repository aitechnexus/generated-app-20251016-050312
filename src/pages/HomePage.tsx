import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, Variants } from 'framer-motion';
import { Search, Code, GitBranch, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AppLayout } from '@/components/layout/AppLayout';
import { useStore } from '@/lib/store';
import { useShallow } from 'zustand/react/shallow';
import { FavoriteRepos } from '@/components/github/FavoriteRepos';
import { RecentRepos } from '@/components/github/RecentRepos';
export function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { userSession } = useStore(
    useShallow((state) => ({
      userSession: state.userSession,
    }))
  );
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/user/${searchTerm.trim()}`);
    }
  };
  const featureVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.5,
        ease: 'easeOut',
      },
    }),
  };
  return (
    <AppLayout>
      <div className="relative isolate overflow-hidden">
        <div
          className="absolute inset-0 -z-10 bg-gradient-mesh opacity-20 dark:opacity-30"
          aria-hidden="true"
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-24 sm:py-32">
            <div className="max-w-2xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
              >
                <h1 className="text-4xl font-bold font-display tracking-tight text-foreground sm:text-6xl">
                  Explore GitHub at the Edge
                </h1>
                <p className="mt-6 text-lg leading-8 text-muted-foreground">
                  A visually stunning and high-performance GitHub client built entirely on the Cloudflare native stack.
                </p>
              </motion.div>
              <motion.form
                onSubmit={handleSearch}
                className="mt-10 flex items-center justify-center gap-x-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="relative w-full max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Enter a GitHub username or organization"
                    className="h-12 pl-12 pr-28 text-base"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Button type="submit" size="lg" className="absolute right-1.5 top-1/2 -translate-y-1/2 h-9 rounded-md px-4">
                    Search
                  </Button>
                </div>
              </motion.form>
            </div>
          </div>
          {userSession ? (
            <div className="pb-24 sm:pb-32 space-y-16">
              <FavoriteRepos />
              <RecentRepos />
            </div>
          ) : (
            <div className="pb-24 sm:pb-32">
              <motion.div
                className="grid grid-cols-1 gap-8 md:grid-cols-3"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={{
                  visible: { transition: { staggerChildren: 0.1 } }
                }}
              >
                <motion.div variants={featureVariants} className="flex flex-col items-center text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Code className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">Browse Code</h3>
                  <p className="mt-1 text-muted-foreground">
                    Navigate repositories with a clean file browser and beautiful syntax highlighting.
                  </p>
                </motion.div>
                <motion.div variants={featureVariants} className="flex flex-col items-center text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <GitBranch className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">Discover Repos</h3>
                  <p className="mt-1 text-muted-foreground">
                    Find public repositories for any user or organization on GitHub.
                  </p>
                </motion.div>
                <motion.div variants={featureVariants} className="flex flex-col items-center text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Star className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">Edge-Powered</h3>
                  <p className="mt-1 text-muted-foreground">
                    Experience incredible performance with a backend running on Cloudflare Workers.
                  </p>
                </motion.div>
              </motion.div>
            </div>
          )}
        </div>
        <footer className="text-center py-8 text-muted-foreground">
          <p>Built with ❤️ at Cloudflare</p>
        </footer>
      </div>
    </AppLayout>
  );
}