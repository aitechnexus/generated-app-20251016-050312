import React from 'react';
import { Star } from 'lucide-react';
import { useStore } from '@/lib/store';
import { useShallow } from 'zustand/react/shallow';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
interface FavoriteButtonProps {
  repoFullName: string;
}
export function FavoriteButton({ repoFullName }: FavoriteButtonProps) {
  const { favorites, toggleFavorite, userSession } = useStore(
    useShallow((state) => ({
      favorites: state.favorites,
      toggleFavorite: state.toggleFavorite,
      userSession: state.userSession,
    }))
  );
  if (!userSession) {
    return null;
  }
  const isFavorited = favorites.includes(repoFullName);
  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(repoFullName);
  };
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
      className="text-muted-foreground hover:text-primary"
    >
      <Star className={cn('h-5 w-5 transition-all', isFavorited ? 'fill-yellow-400 text-yellow-400' : 'fill-transparent')} />
    </Button>
  );
}