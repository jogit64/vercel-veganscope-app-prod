
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Ajout des genres pour l'affichage des filtres
export const movieGenres = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Aventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comédie' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentaire' },
  { id: 18, name: 'Drame' },
  { id: 10751, name: 'Famille' },
  { id: 14, name: 'Fantastique' },
  { id: 36, name: 'Histoire' },
  { id: 27, name: 'Horreur' },
  { id: 10402, name: 'Musique' },
  { id: 9648, name: 'Mystère' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Science-Fiction' },
  { id: 10770, name: 'Téléfilm' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'Guerre' },
  { id: 37, name: 'Western' }
];

// Liste à jour des genres de séries selon TMDb
export const tvGenres = [
  { id: 10759, name: 'Action & Aventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comédie' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentaire' },
  { id: 18, name: 'Drame' },
  { id: 10751, name: 'Famille' },
  { id: 10762, name: 'Enfants' },
  { id: 9648, name: 'Mystère' },
  { id: 10763, name: 'Actualités' },
  { id: 10764, name: 'Réalité' },
  { id: 10765, name: 'Science-Fiction & Fantastique' },
  { id: 10766, name: 'Soap' },
  { id: 10767, name: 'Talk' },
  { id: 10768, name: 'Guerre & Politique' },
  { id: 37, name: 'Western' }
];

// Tous les genres combinés pour l'affichage
export const allGenres = [...movieGenres, ...tvGenres.filter(tvGenre => 
  !movieGenres.some(movieGenre => movieGenre.id === tvGenre.id)
)];

// Fonction pour obtenir le nom d'un genre à partir de son ID
export const genreIdToName = (id: number): string => {
  const genre = allGenres.find(genre => genre.id === id);
  return genre ? genre.name : 'Genre inconnu';
};
