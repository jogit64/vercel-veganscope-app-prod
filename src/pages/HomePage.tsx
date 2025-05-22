import React, { useEffect, useState } from "react";
import SearchBar from "@/components/SearchBar";
import SectionHeader from "@/components/SectionHeader";
import MediaGrid from "@/components/MediaGrid";
import { useAppContext } from "@/contexts/AppContext";
import { useMedia } from "@/hooks/useMedia";
import { useEvaluations } from "@/hooks/useEvaluations";
import {
  fetchTrendingMovies,
  fetchTrendingTVSeries,
  fetchMediaDetails,
} from "@/lib/api";
import { Media } from "@/types";
import { Loader2 } from "lucide-react";

const HomePage: React.FC = () => {
  const { genres } = useAppContext();
  const { evaluations } = useEvaluations();

  const [recentMovies, setRecentMovies] = useState<Media[]>([]);
  const [recentTvShows, setRecentTvShows] = useState<Media[]>([]);
  const [recentEvaluatedMedia, setRecentEvaluatedMedia] = useState<Media[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch trending movies and TV shows
  useEffect(() => {
    const loadHomePageData = async () => {
      setIsLoading(true);

      try {
        // Fetch trending movies
        const moviesResponse = await fetchTrendingMovies();
        if (moviesResponse && moviesResponse.results) {
          const formattedMovies = moviesResponse.results
            .map((movie: any) => ({
              id: movie.id,
              title: movie.title,
              overview: movie.overview,
              posterPath: movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : null,
              backdropPath: movie.backdrop_path
                ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
                : null,
              releaseDate: movie.release_date,
              genreIds: movie.genre_ids || [],
              mediaType: "movie" as const,
            }))
            .slice(0, 4);

          setRecentMovies(formattedMovies);
        }

        // Fetch trending TV shows
        const tvResponse = await fetchTrendingTVSeries();
        if (tvResponse && tvResponse.results) {
          const formattedShows = tvResponse.results
            .map((show: any) => ({
              id: show.id,
              title: show.name,
              overview: show.overview,
              posterPath: show.poster_path
                ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
                : null,
              backdropPath: show.backdrop_path
                ? `https://image.tmdb.org/t/p/original${show.backdrop_path}`
                : null,
              firstAirDate: show.first_air_date,
              genreIds: show.genre_ids || [],
              mediaType: "tv" as const,
            }))
            .slice(0, 4);

          setRecentTvShows(formattedShows);
        }
      } catch (error) {
        console.error("Error loading homepage data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadHomePageData();
  }, []);

  // Process any available evaluations for the "Recently evaluated" section
  useEffect(() => {
    const processEvaluations = async () => {
      if (evaluations.length > 0) {
        // Get the most recent evaluations
        const recentEvals = [...evaluations]
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .slice(0, 4);

        // For each evaluation, fetch the associated media details
        const evaluatedMedia = await Promise.all(
          recentEvals.map(async (evaluation) => {
            try {
              const details = await fetchMediaDetails(
                evaluation.mediaId,
                evaluation.mediaType
              );
              if (details) {
                return {
                  id: details.id,
                  title:
                    evaluation.mediaType === "movie"
                      ? details.title
                      : details.name,
                  overview: details.overview,
                  posterPath: details.poster_path
                    ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
                    : null,
                  backdropPath: details.backdrop_path
                    ? `https://image.tmdb.org/t/p/original${details.backdrop_path}`
                    : null,
                  releaseDate: details.release_date,
                  firstAirDate: details.first_air_date,
                  genreIds: details.genres
                    ? details.genres.map((g: any) => g.id)
                    : [],
                  mediaType: evaluation.mediaType,
                  evaluationRating: evaluation.rating,
                };
              }
              return null;
            } catch (error) {
              console.error(
                `Error fetching media ${evaluation.mediaId}:`,
                error
              );
              return null;
            }
          })
        );

        setRecentEvaluatedMedia(evaluatedMedia.filter(Boolean) as Media[]);
      }
    };

    processEvaluations();
  }, [evaluations]);

  if (isLoading && recentMovies.length === 0 && recentTvShows.length === 0) {
    return (
      <div className="py-20 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="pb-20">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Veganscope</h1>
        <SearchBar />
      </div>

      {recentEvaluatedMedia.length > 0 && (
        <section className="mb-8">
          <SectionHeader title="Derniers avis" linkTo="/evaluations" />
          <MediaGrid items={recentEvaluatedMedia} />
        </section>
      )}

      <section className="mb-8">
        <SectionHeader title="Films populaires" linkTo="/movies" />
        <MediaGrid items={recentMovies} />
      </section>

      <section className="mb-8">
        <SectionHeader title="Séries populaires" linkTo="/tv" />
        <MediaGrid items={recentTvShows} />
      </section>
    </div>
  );
};

export default HomePage;
