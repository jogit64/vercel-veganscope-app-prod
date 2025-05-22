
export type EthicalRating = 'green' | 'yellow' | 'red' | 'unrated';

export interface EthicalCriteria {
  id: string;
  label: string;
  description: string;
  checked: boolean;
}

export interface MediaEvaluation {
  id: string;
  mediaId: number;
  mediaType: 'movie' | 'tv';
  username: string;
  rating: EthicalRating;
  comment: string;
  criteria: EthicalCriteria[];
  createdAt: string;
}

export interface Media {
  id: number;
  title: string;
  overview: string | null;
  posterPath: string | null;
  backdropPath: string | null;
  releaseDate?: string;  // For movies
  firstAirDate?: string; // For TV shows
  genreIds: number[];
  mediaType: 'movie' | 'tv';
  evaluationRating?: EthicalRating; // Add this property for use in evaluations page
}

export interface Genre {
  id: number;
  name: string;
}

export interface MediaFilters {
  mediaType: 'all' | 'movie' | 'tv';
  genreId: number | null;
  year: string | null;
  ethicalRating: EthicalRating | 'all';
}
