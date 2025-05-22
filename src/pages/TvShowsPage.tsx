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

/* --- utilitaire lisibilité titre ------------------------------------ */
const isTitleReadable = (title: string): boolean => {
  const letters = title.match(/\p{Letter}/gu);
  if (!letters) return false;
  const latinLetters = letters.filter((ch) => /\p{Script=Latin}/u.test(ch));
  return latinLetters.length / letters.length >= 0.6;
};

/* --- conversion TMDB -> Media --------------------------------------- */
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

  const isFetchingRef = useRef(false); // ⬅️ évite la boucle

  /* ------------------ filtres --------------------------------------- */
  const [filters, setFilters] = useState<MediaFilters>({
    mediaType: "tv",
    genreId: null,
    year: null,
    ethicalRating: "all",
  });

  /* ------------------ eval végane ----------------------------------- */
  const applyEvaluation = useCallback(
    (media: Media): Media => {
      const e = evaluations.find(
        (ev) => ev.mediaId === media.id && ev.mediaType === "tv"
      );
      return { ...media, evaluationRating: e ? e.rating : "unrated" };
    },
    [evaluations]
  );

  /* ------------------ fetch ----------------------------------------- */
  const PAGE_SIZE = 20;

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
          .filter((m) => isTitleReadable(m.title)) // <== filtre caractères latins ici
          .map(applyEvaluation)
          .filter(
            (m) =>
              filters.ethicalRating === "all" ||
              m.evaluationRating === filters.ethicalRating
          );

        /* éviter les doublons si TMDb renvoie accidentellement la même série */
        setItems((prev) => {
          const seen = new Set(prev.map((i) => i.id));
          const merged = reset
            ? batch
            : [...prev, ...batch.filter((i) => !seen.has(i.id))];
          return merged;
        });

        setPage(pageToLoad);
        setHasMore(response.hasMore); // ← on fait confiance à l’API
      } catch (err) {
        console.error(err);
      } finally {
        isFetchingRef.current = false;
        setIsFetching(false);
      }
    },
    [filters, applyEvaluation]
  );

  /* --- reset & premier chargement quand filtres changent ------------ */
  useEffect(() => {
    setItems([]);
    setHasMore(true);
    setPage(1);
    fetchShows(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]); // ✅ fetchShows plus dans deps

  /* ------------------ infinite scroll ------------------------------- */
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

  /* ------------------ rendu ----------------------------------------- */
  return (
    <div className="pb-20">
      <PageHeader title="Séries" />

      <div className="mb-4">
        <SearchBar placeholder="Rechercher une série..." />
      </div>

      <FilterPanel
        filters={filters}
        onFilterChange={(f) => setFilters((p) => ({ ...p, ...f }))}
        genres={tvGenres}
        hideMediaType={true} // 👈 ajoute cette ligne ici !
        className="mb-4"
      />

      {/* spinner initial */}
      {items.length === 0 && isFetching && (
        <div className="py-20 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      )}

      {/* résultats */}
      {items.length > 0 && <MediaGrid items={items} />}

      {/* aucun résultat */}
      {items.length === 0 && !isFetching && (
        <p className="py-8 text-center text-gray-500">
          Aucune série ne correspond aux critères de recherche
        </p>
      )}

      {/* sentinel pour scroll infini */}
      <div ref={sentinelRef} className="h-1 w-full" />

      {/* spinner de scroll */}
      {isFetching && items.length > 0 && (
        <div className="py-8 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
        </div>
      )}

      {/* fin de liste */}
      {!hasMore && !isFetching && items.length > 0 && (
        <p className="text-center py-8 text-gray-500 text-sm">
          Toutes les séries ont été chargées
        </p>
      )}
    </div>
  );
};

export default TvShowsPage;
