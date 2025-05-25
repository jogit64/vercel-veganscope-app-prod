import React, { useState, useEffect, useRef, useCallback } from "react";
import PageHeader from "@/components/PageHeader";
import MediaGrid from "@/components/MediaGrid";
import FilterPanel from "@/components/FilterPanel";
import { useAppContext } from "@/contexts/AppContext";
import { useEvaluations } from "@/hooks/useEvaluations";
import { fetchTrendingMovies } from "@/lib/api";
import { Media, MediaFilters } from "@/types";
import { Loader2 } from "lucide-react";

const isTitleReadable = (title: string): boolean => {
  const letters = title.match(/\p{Letter}/gu);
  if (!letters) return false;
  const latinLetters = letters.filter((ch) => /\p{Script=Latin}/u.test(ch));
  return latinLetters.length / letters.length >= 0.6;
};

const MoviesPage: React.FC = () => {
  const { genres } = useAppContext();
  const { evaluations } = useEvaluations();
  const [movies, setMovies] = useState<Media[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const isFetchingRef = useRef(false);

  const [filters, setFilters] = useState<MediaFilters>({
    mediaType: "movie",
    genreId: null,
    year: null,
    ethicalRating: "all",
  });

  const applyEvaluation = useCallback(
    (movie: Media): Media => {
      const evaluation = evaluations.find(
        (e) => e.mediaId === movie.id && e.mediaType === "movie"
      );
      return {
        ...movie,
        evaluationRating: evaluation ? evaluation.rating : "unrated",
      };
    },
    [evaluations]
  );

  const fetchMovies = useCallback(
    async (pageToLoad: number, reset = false) => {
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;
      setIsFetching(true);

      try {
        const params: any = {
          page: pageToLoad,
          sort_by: "popularity.desc",
        };

        if (filters.genreId !== null) {
          params.with_genres = filters.genreId.toString();
        }
        if (filters.year !== null) {
          params.year = filters.year;
        }

        const response = await fetchTrendingMovies(params);
        console.log("➡️ Appel fetchMovies", { pageToLoad, reset, filters });
        console.log("📦 Résultats bruts TMDb", response.results.length);

        const batch = response.results
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
          .filter((m) => isTitleReadable(m.title))
          .map(applyEvaluation)
          .filter(
            (m) =>
              filters.ethicalRating === "all" ||
              m.evaluationRating === filters.ethicalRating
          );
        console.log("🎯 Après filtrage lisible", batch.length);

        setMovies((prev) => {
          const seen = new Set(prev.map((m) => m.id));
          const filtered = batch.filter((m) => !seen.has(m.id));
          const merged = reset ? batch : [...prev, ...filtered];

          if (!reset && filtered.length === 0) {
            setHasMore(false);
          } else {
            setHasMore(true);
          }

          return merged;
        });

        setPage(pageToLoad);
      } catch (error) {
        console.error("Error loading movies:", error);
        setHasMore(false);
      } finally {
        isFetchingRef.current = false;
        setIsFetching(false);
      }
    },
    [filters, applyEvaluation]
  );

  useEffect(() => {
    setMovies([]);
    setPage(1);
    setHasMore(true);
    fetchMovies(1, true);
  }, [filters, fetchMovies]);

  useEffect(() => {
    const onIntersect: IntersectionObserverCallback = (entries) => {
      if (entries[0].isIntersecting && hasMore && !isFetchingRef.current) {
        fetchMovies(page + 1);
      }
    };

    const observer = new IntersectionObserver(onIntersect, {
      rootMargin: "600px 0px",
      threshold: 0,
    });

    const el = loaderRef.current;
    if (el) observer.observe(el);
    return () => el && observer.unobserve(el);
  }, [fetchMovies, hasMore, page]);

  return (
    <div className="pb-20">
      <div className="mb-6 pt-4">
        <div className="flex items-start gap-3 px-4 py-4 bg-card text-card-foreground border border-border rounded-xl shadow-md">
          <PageHeader
            title="Films"
            icon="film"
            description="Utilisez les filtres pour trouver/évaluer un film"
          />
        </div>
      </div>

      <FilterPanel
        filters={filters}
        onFilterChange={(f) => setFilters((prev) => ({ ...prev, ...f }))}
        genres={genres}
        hideMediaType={true}
      />

      {/* Loader initial si aucun film chargé */}
      {movies.length === 0 && isFetching && (
        <div className="py-20 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Grille des films */}
      {movies.length > 0 && <MediaGrid items={movies} />}

      {/* Sentinel pour infinite scroll */}
      <div ref={loaderRef} className="h-1 w-full" />

      {/* Spinner de chargement pour pages suivantes */}
      {isFetching && movies.length > 0 && (
        <div className="py-8 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Message fin de liste */}
      {!hasMore && !isFetching && movies.length > 0 && (
        <div className="text-center py-8 text-muted-foreground text-sm">
          🎬 Tous les films correspondants ont été affichés.
        </div>
      )}
    </div>
  );
};

export default MoviesPage;
