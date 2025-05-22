
import { useState, useEffect } from 'react';
import { Media, MediaFilters, EthicalRating } from '@/types';

/**
 * Hook personnalisé pour filtrer les médias (films et séries) selon divers critères
 */
export function useMediaFiltering(
  items: Media[],
  initialFilters: MediaFilters
) {
  // État des filtres avec valeurs initiales
  const [filters, setFilters] = useState<MediaFilters>(initialFilters);
  // État des résultats filtrés
  const [filteredItems, setFilteredItems] = useState<Media[]>(items);
  
  // Applique les filtres quand les items ou les critères changent
  useEffect(() => {
    // Fonction de filtrage centrale utilisée par toutes les pages
    const filterMedia = (mediaItems: Media[], criteria: MediaFilters) => {
      return mediaItems.filter(item => {
        // 1. Filtre par type de média (movie/tv/all)
        if (criteria.mediaType !== 'all' && item.mediaType !== criteria.mediaType) {
          return false;
        }
        
        // 2. Filtre par genre
        if (criteria.genreId !== null && !item.genreIds.includes(criteria.genreId)) {
          return false;
        }
        
        // 3. Filtre par année (vérifie release_date pour films et first_air_date pour séries)
        if (criteria.year !== null) {
          const date = item.mediaType === 'movie' ? item.releaseDate : item.firstAirDate;
          if (!date || !date.startsWith(criteria.year)) {
            return false;
          }
        }
        
        // 4. Filtre par évaluation éthique
        if (criteria.ethicalRating !== 'all') {
          // Utilise directement la propriété evaluationRating attachée à chaque média
          const rating = item.evaluationRating || 'unrated';
          if (rating !== criteria.ethicalRating) {
            return false;
          }
        }
        
        // Si tous les filtres sont passés, inclure l'élément
        return true;
      });
    };
    
    // Application du filtre et mise à jour des résultats
    const results = filterMedia(items, filters);
    setFilteredItems(results);
  }, [items, filters]); // Réagit aux changements de la liste source ou des filtres
  
  // Manipulation des filtres avec préservation du mediaType si fixé
  const handleFilterChange = (newFilters: MediaFilters) => {
    // Si on est sur une page avec un type fixé (Films ou Séries),
    // on s'assure que le mediaType reste fixe
    if (initialFilters.mediaType !== 'all') {
      newFilters.mediaType = initialFilters.mediaType;
    }
    
    setFilters(newFilters);
  };
  
  return {
    filters,
    setFilters,
    filteredItems,
    handleFilterChange
  };
}
