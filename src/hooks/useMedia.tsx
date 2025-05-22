
import { useState } from 'react';
import { createContext, useContext } from 'react';
import { Media } from '@/types';

interface MediaContextProps {
  movies: Media[];
  tvShows: Media[];
  getMediaById: (id: number, mediaType: 'movie' | 'tv') => Media | undefined;
  isLoading: boolean;
}

const MediaContext = createContext<MediaContextProps | undefined>(undefined);

export const useMediaContext = () => {
  const context = useContext(MediaContext);
  if (context === undefined) {
    throw new Error('useMediaContext must be used within a MediaProvider');
  }
  return context;
};

export const MediaProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  // Track media items separately
  const [movies, setMovies] = useState<Media[]>([]);
  const [tvShows, setTvShows] = useState<Media[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getMediaById = (id: number, mediaType: 'movie' | 'tv'): Media | undefined => {
    if (mediaType === 'movie') {
      return movies.find(movie => movie.id === id);
    } else {
      return tvShows.find(tvShow => tvShow.id === id);
    }
  };

  const value = {
    movies,
    tvShows,
    getMediaById,
    isLoading
  };

  return (
    <MediaContext.Provider value={value}>
      {children}
    </MediaContext.Provider>
  );
};

// Hook to expose media context in components that don't need to provide it
export const useMedia = () => {
  return {
    ...useMediaContext()
  };
};
