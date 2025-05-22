
import { useState, useEffect } from 'react';
import { createContext, useContext } from 'react';

interface FavoritesContextProps {
  favorites: number[];
  addFavorite: (mediaId: number) => void;
  removeFavorite: (mediaId: number) => void;
  isFavorite: (mediaId: number) => boolean;
}

const FavoritesContext = createContext<FavoritesContextProps | undefined>(undefined);

export const useFavoritesContext = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavoritesContext must be used within an FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [favorites, setFavorites] = useState<number[]>([]);

  // Load favorites from localStorage
  useEffect(() => {
    const storedFavorites = localStorage.getItem('veganscope_favorites');
    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites));
      } catch (e) {
        console.error('Error loading favorites:', e);
      }
    }
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('veganscope_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (mediaId: number) => {
    setFavorites(prev => [...prev, mediaId]);
  };

  const removeFavorite = (mediaId: number) => {
    setFavorites(prev => prev.filter(id => id !== mediaId));
  };

  const isFavorite = (mediaId: number) => {
    return favorites.includes(mediaId);
  };

  const value = { 
    favorites, 
    addFavorite, 
    removeFavorite, 
    isFavorite 
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

// Hook to expose favorites context in components that don't need to provide it
export const useFavorites = () => {
  return {
    ...useFavoritesContext()
  };
};
