import React, { useState, useEffect, useRef, useCallback } from "react";
import PageHeader from "@/components/PageHeader";
import SearchBar from "@/components/SearchBar";
import MediaGrid from "@/components/MediaGrid";
import FilterPanel from "@/components/FilterPanel";
import { useAppContext } from "@/contexts/AppContext";
import { useEvaluations } from "@/hooks/useEvaluations";
import { fetchTrendingMovies } from "@/lib/api";
import { Media, MediaFilters } from "@/types";
import { Loader2 } from "lucide-react";
import { useMediaFiltering } from "@/hooks/useMediaFiltering";

const MoviesPage: React.FC = () => {
  const { genres } = useAppContext();
  const { evaluations } = useEvaluations();
  const [page, setPage] = useState<number>(1);
  const [movies, setMovies] = useState<Media[]>([]);
  const [formattedMovies, setFormattedMovies] = useState<Media[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);
  const [hasAttemptedLoad, setHasAttemptedLoad] = useState<boolean>(false);
  const loaderRef = useRef<HTMLDivElement>(null);

  const isTitleReadable = (title: string): boolean => {
    const letters = title.match(/\p{Letter}/gu);
    if (!letters) return false;
    const latinLetters = letters.filter((ch) => /\p{Script=Latin}/u.test(ch));
    return latinLetters.length / letters.length >= 0.6;
  };

  const initialFilters: MediaFilters = {
    mediaType: "movie",
    genreId: null,
    year: null,
    ethicalRating: "all",
  };

  useEffect(() => {
    const moviesWithEvaluations = movies.map((movie) => {
      const evaluation = evaluations.find(
        (e) => e.mediaId === movie.id && e.mediaType === "movie"
      );
      return {
        ...movie,
        evaluationRating: evaluation ? evaluation.rating : "unrated",
      };
    });

    setFormattedMovies(moviesWithEvaluations);
  }, [movies, evaluations]);

  const {
    filters,
    filteredItems: filteredMovies,
    handleFilterChange,
  } = useMediaFiltering(formattedMovies, initialFilters);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && !isLoading && hasMore) {
        setPage((prev) => prev + 1);
      }
    },
    [isLoading, hasMore]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0,
      rootMargin: "600px 0px",
    });
    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [handleObserver]);

  useEffect(() => {
    const loadMovies = async () => {
      if (!hasMore && page > 1) return;

      if (page === 1) {
        setHasMore(true); // ✅ reset hasMore si reset de page
      }

      setIsLoading(true);

      try {
        const params: any = {
          page,
          sort_by: "popularity.desc", // ✅ tri par popularité
        };

        if (filters.genreId !== null) {
          params.with_genres = filters.genreId.toString();
        }

        if (filters.year !== null) {
          params.year = filters.year;
        }

        const response = await fetchTrendingMovies(params);
        setHasAttemptedLoad(true);

        if (response && response.results) {
          const newMovies = response.results
            .map((movie: any) => ({
              id: movie.id,
              title: movie.title || movie.name,
              overview: movie.overview,
              posterPath: movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : null,
              backdropPath: movie.backdrop_path
                ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
                : null,
              releaseDate: movie.release_date,
              genreIds: movie.genre_ids || [],
              mediaType: "movie",
            }))
            .filter((m) => isTitleReadable(m.title));

          setMovies((prev) =>
            page === 1 ? newMovies : [...prev, ...newMovies]
          );
          setTotalPages(response.total_pages || 1);

          if (newMovies.length === 0 || page >= (response.total_pages || 1)) {
            setHasMore(false);
          } else {
            setHasMore(true);
          }
        } else {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Error loading movies:", error);
        setHasMore(false);
      } finally {
        setIsLoading(false);
        setIsInitialLoad(false);
      }
    };

    loadMovies();
  }, [page, filters.genreId, filters.year]);

  // ✅ Scroll forcé si peu de résultats après le premier chargement
  useEffect(() => {
    if (!isInitialLoad && hasMore && movies.length < 10 && page === 1) {
      setPage(2);
    }
  }, [isInitialLoad, hasMore, movies.length, page]);

  // ✅ Reset pagination si les filtres changent
  useEffect(() => {
    setPage(1);
  }, [filters.ethicalRating, filters.genreId, filters.year]);

  return (
    <div className="pb-20">
      <PageHeader title="Films" />

      <div className="mb-4">
        <SearchBar placeholder="Rechercher un film..." />
      </div>

      <FilterPanel
        filters={filters}
        onFilterChange={handleFilterChange}
        genres={genres}
        hideMediaType={true} // 👈 masque "tous / films / séries"
      />

      {isInitialLoad && isLoading ? (
        <div className="py-20 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      ) : (
        <>
          {filteredMovies.length > 0 ? (
            <MediaGrid items={filteredMovies} />
          ) : (
            <div className="py-8 text-center">
              <p className="text-gray-500">
                Aucun film ne correspond aux critères de recherche
              </p>
            </div>
          )}

          <div ref={loaderRef} className="h-1 w-full" />

          {hasMore &&
            !isInitialLoad &&
            filteredMovies.length > 0 &&
            isLoading && (
              <div className="py-8 flex justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
              </div>
            )}

          {!hasMore && filteredMovies.length > 0 && (
            <div className="text-center py-8 text-gray-500 text-sm">
              Tous les films ont été chargés
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MoviesPage;
