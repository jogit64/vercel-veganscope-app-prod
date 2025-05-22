import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Media, Genre } from '@/types';
import { genres as mockGenres } from '@/data/mockData';
import { useFavorites } from '@/hooks/useFavorites';
import { useEvaluations } from '@/hooks/useEvaluations';
import { useMedia } from '@/hooks/useMedia';

interface AppContextProps {
  movies: Media[];
  tvShows: Media[];
  genres: Genre[];
  isLoading: boolean;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  // Keep genres in main context since they're static
  const [genres] = useState<Genre[]>(mockGenres);
  
  // Use separate hooks for different functionality
  const { movies, tvShows, isLoading: isMediaLoading } = useMedia();
  const { isLoading: isEvaluationLoading } = useEvaluations();
  
  // Use favorites hook
  useFavorites();

  const value = {
    movies,
    tvShows,
    genres,
    isLoading: isMediaLoading || isEvaluationLoading
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
