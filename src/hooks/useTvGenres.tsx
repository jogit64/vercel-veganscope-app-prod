
import { useState, useEffect } from 'react';
import { fetchTvGenres } from '@/lib/api';
import { Genre } from '@/types';
import { tvGenres as fallbackTvGenres } from '@/lib/utils';

export function useTvGenres() {
  const [genres, setGenres] = useState<Genre[]>(fallbackTvGenres);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGenres = async () => {
      try {
        setIsLoading(true);
        const apiGenres = await fetchTvGenres();
        
        if (apiGenres && apiGenres.length > 0) {
          console.log('Loaded TV genres from API:', apiGenres.length);
          setGenres(apiGenres);
        } else {
          console.log('Using fallback TV genres');
          setGenres(fallbackTvGenres);
        }
        setError(null);
      } catch (err) {
        console.error('Error loading TV genres:', err);
        setError('Impossible de charger les genres. Utilisation des données de secours.');
        setGenres(fallbackTvGenres);
      } finally {
        setIsLoading(false);
      }
    };

    loadGenres();
  }, []);

  return { tvGenres: genres, isLoadingTvGenres: isLoading, tvGenresError: error };
}
