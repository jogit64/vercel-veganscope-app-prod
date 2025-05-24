import React, { useState, useEffect, useRef, useCallback } from "react";
import PageHeader from "@/components/PageHeader";
import SearchBar from "@/components/SearchBar";
import MediaGrid from "@/components/MediaGrid";
import FilterPanel from "@/components/FilterPanel";
import { useEvaluations } from "@/hooks/useEvaluations";
import { useTvGenres } from "@/hooks/useTvGenres";
import { fetchTrendingTVSeries } from "@/lib/api";
import { Media, MediaFilters } from "@/types";
import { Loader2 } from "lucide-react";

const isTitleReadable = (title: string): boolean => {
  const letters = title.match(/\p{Letter}/gu);
  if (!letters) return false;
  const latinLetters = letters.filter((ch) => /\p{Script=Latin}/u.test(ch));
  return latinLetters.length / letters.length >= 0.6;
};

const tmdbToMedia = (show: any): Media => ({
  id: show.id,
  title: show.name || show.title || "",
  overview: show.overview,
  posterPath: show.poster_path
    ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
    : null,
  backdropPath: show.backdrop_path
    ? `https://image.tmdb.org/t/p/original${show.backdrop_path}`
    : null,
  firstAirDate: show.first_air_date,
  genreIds: show.genre_ids || [],
  mediaType: "tv",
});

const TvShowsPage: React.FC = () => {
  const { tvGenres } = useTvGenres();
  const { evaluations } = useEvaluations();

  const [items, setItems] = useState<Media[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  const isFetchingRef = useRef(false);

  const [filters, setFilters] = useState<MediaFilters>({
    mediaType: "tv",
    genreId: null,
    year: null,
    ethicalRating: "all",
  });

  const applyEvaluation = useCallback(
    (media: Media): Media => {
      const e = evaluations.find(
        (ev) => ev.mediaId === media.id && ev.mediaType === "tv"
      );
      return { ...media, evaluationRating: e ? e.rating : "unrated" };
    },
    [evaluations]
  );

  const fetchShows = useCallback(
    async (pageToLoad: number, reset = false) => {
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;
      setIsFetching(true);

      try {
        const params: any = {
          page: pageToLoad,
          sort_by: "popularity.desc",
        };
        if (filters.genreId) params.with_genres = String(filters.genreId);
        if (filters.year) params.year = filters.year;

        const response = await fetchTrendingTVSeries(params);

        const batch = response.results
          .map(tmdbToMedia)
          .filter((m) => isTitleReadable(m.title))
          .map(applyEvaluation)
          .filter(
            (m) =>
              filters.ethicalRating === "all" ||
              m.evaluationRating === filters.ethicalRating
          );

        setItems((prev) => {
          const seen = new Set(prev.map((i) => i.id));
          const filtered = batch.filter((i) => !seen.has(i.id));
          const merged = reset ? batch : [...prev, ...filtered];

          if (!reset && filtered.length === 0) {
            setHasMore(false);
          }

          return merged;
        });

        setPage(pageToLoad);
      } catch (err) {
        console.error(err);
        setHasMore(false);
      } finally {
        isFetchingRef.current = false;
        setIsFetching(false);
      }
    },
    [filters, applyEvaluation]
  );

  useEffect(() => {
    setItems([]);
    setHasMore(true);
    setPage(1);
    fetchShows(1, true);
  }, [filters]);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onIntersect: IntersectionObserverCallback = (entries) => {
      if (entries[0].isIntersecting && hasMore && !isFetchingRef.current) {
        fetchShows(page + 1);
      }
    };

    const observer = new IntersectionObserver(onIntersect, {
      rootMargin: "600px 0px",
      threshold: 0,
    });

    const el = sentinelRef.current;
    if (el) observer.observe(el);
    return () => el && observer.unobserve(el);
  }, [fetchShows, hasMore, page]);

  return (
    <div className="pb-20">
      <div className="mb-6 pt-4">
        <div className="flex items-start gap-3 px-4 py-4 bg-card text-card-foreground border border-border rounded-xl shadow-md">
          <PageHeader
            title="Séries"
            icon="tv"
            description="Trouvez/évaluez des séries"
          />
        </div>
      </div>

      <FilterPanel
        filters={filters}
        onFilterChange={(f) => setFilters((p) => ({ ...p, ...f }))}
        genres={tvGenres}
        hideMediaType={true}
        className="mb-4"
      />

      {items.length === 0 && isFetching && (
        <div className="py-20 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {items.length > 0 && <MediaGrid items={items} />}

      {items.length === 0 && !isFetching && (
        <p className="py-8 text-center text-gray-500">
          Aucune série ne correspond aux critères de recherche
        </p>
      )}

      <div ref={sentinelRef} className="h-1 w-full" />

      {isFetching && items.length > 0 && (
        <div className="py-8 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {!hasMore && !isFetching && items.length > 0 && (
        <p className="text-center py-8 text-muted-foreground text-sm">
          📺 Toutes les séries correspondantes ont été affichées.
        </p>
      )}
    </div>
  );
};

export default TvShowsPage;
