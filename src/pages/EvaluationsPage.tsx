import React, { useEffect, useState, useRef, useCallback } from "react";
import PageHeader from "@/components/PageHeader";
import { useAppContext } from "@/contexts/AppContext";
import { useEvaluations } from "@/hooks/useEvaluations";
import { Button } from "@/components/ui/button";
import { RefreshCcw, Loader2 } from "lucide-react";
import MediaGrid from "@/components/MediaGrid";
import FilterPanel, { MediaFilters } from "@/components/FilterPanel";
import { Media, MediaEvaluation } from "@/types";
import { fetchMediaDetails } from "@/lib/api";

const ITEMS_PER_PAGE = 20;

/**
 * Page "Avis" – affiche les médias évalués par l'utilisateur, avec filtres et lazy‑load.
 */
const EvaluationsPage: React.FC = () => {
  /* ────────────────────────────────────────────────────────────────── */
  /* CONTEXTES & HOOKS PERSO                                          */
  /* ────────────────────────────────────────────────────────────────── */
  const { genres } = useAppContext();
  const {
    evaluations,
    refreshEvaluations,
    isLoading: isEvaluationsLoading,
  } = useEvaluations();

  /* ────────────────────────────────────────────────────────────────── */
  /* ÉTATS LOCAUX                                                      */
  /* ────────────────────────────────────────────────────────────────── */
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [evaluatedMedia, setEvaluatedMedia] = useState<Media[]>([]);
  const [filteredMedia, setFilteredMedia] = useState<Media[]>([]);
  const [filters, setFilters] = useState<MediaFilters>({
    mediaType: "all",
    genreId: null,
    year: null,
    ethicalRating: "all",
  });

  // const [displayedMedia, setDisplayedMedia] = useState<Media[]>([]);
  const [page, setPage] = useState(1);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const displayedMedia = React.useMemo(
    () => filteredMedia.slice(0, page * ITEMS_PER_PAGE),
    [filteredMedia, page]
  );

  // Pour pouvoir les inspecter depuis la console
  useEffect(() => {
    // expose dans window pour debugger
    (window as any).__EVALS__ = evaluations;
    (window as any).__DISPLAYED__ = displayedMedia;
  }, [evaluations, displayedMedia]);

  /* ────────────────────────────────────────────────────────────────── */
  /* RAFRAÎCHISSEMENT MANUEL                                           */
  /* ────────────────────────────────────────────────────────────────── */
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshEvaluations();
    setIsRefreshing(false);
  };

  /* ────────────────────────────────────────────────────────────────── */
  /* CHARGEMENT DES MÉDIAS AVEC DÉTAILS TMDb                           */
  /* ────────────────────────────────────────────────────────────────── */
  useEffect(() => {
    const loadEvaluatedMedia = async () => {
      console.log(
        `▶️ loadEvaluatedMedia démarré, évaluations reçues = ${evaluations.length}`
      );

      const mediaWithDetails: Media[] = await Promise.all(
        evaluations.map(async (evalItem: MediaEvaluation) => {
          try {
            /* 1️⃣  Normalisation du type avant appel TMDb */
            const rawType = evalItem.mediaType; // "film", "série", "movie", "tv", etc.
            console.log("🔍 rawType Supabase:", rawType);

            const mediaTypeNormalized =
              rawType === "movie" || rawType === "film"
                ? "movie"
                : rawType === "tv" || rawType === "série"
                ? "tv"
                : "unknown";

            /* 2️⃣  Récupération des détails */
            const details = await fetchMediaDetails(
              evalItem.mediaId,
              mediaTypeNormalized
            );
            if (!details) return null; // seules les vraies 404 sont ignorées

            /* 3️⃣  Mapping vers notre modèle interne */
            return {
              id: details.id,
              title:
                mediaTypeNormalized === "movie" ? details.title : details.name,
              overview:
                details.overview ||
                evalItem.comment ||
                "No description available",
              posterPath: details.poster_path
                ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
                : null,
              backdropPath: details.backdrop_path
                ? `https://image.tmdb.org/t/p/original${details.backdrop_path}`
                : null,
              releaseDate: details.release_date,
              firstAirDate: details.first_air_date,
              genreIds: details.genres?.map((g: any) => g.id) || [],
              mediaType: mediaTypeNormalized,
              evaluationRating: evalItem.rating,
            } as Media;
          } catch (error) {
            console.error("Error fetching details for", evalItem.mediaId);
            return null;
          }
        })
      ).then((results) => {
        const filtered = results.filter(Boolean) as Media[];
        console.log(`💧 mediaWithDetails calculé, length = ${filtered.length}`);
        return filtered;
      });

      setEvaluatedMedia(mediaWithDetails);
      console.log(
        `✅ evaluatedMedia mis à jour, length = ${mediaWithDetails.length}`
      );
    };

    loadEvaluatedMedia();
  }, [evaluations]);

  /* ────────────────────────────────────────────────────────────────── */
  /* APPLICATION DES FILTRES                                           */
  /* ────────────────────────────────────────────────────────────────── */
  useEffect(() => {
    console.log(
      "🔄 useEffect de filtres déclenché – mediaType =",
      filters.mediaType
    );
    console.groupCollapsed("🗂  Application des filtres");
    console.log("Filtres :", filters);
    console.log("Médias chargés :", evaluatedMedia.length);

    const filtered = evaluatedMedia.filter((media) => {
      if (
        filters.mediaType !== "all" &&
        media.mediaType !== filters.mediaType
      ) {
        console.log("⛔ exclu (type)", media.title, media.mediaType);
        return false;
      }
      if (
        filters.genreId !== null &&
        !media.genreIds.includes(filters.genreId)
      ) {
        console.log("⛔ exclu (genre)", media.title);
        return false;
      }
      if (filters.year !== null) {
        const mediaDate = media.releaseDate || media.firstAirDate;
        if (
          !mediaDate ||
          new Date(mediaDate).getFullYear().toString() !== filters.year
        ) {
          console.log("⛔ exclu (année)", media.title);
          return false;
        }
      }
      if (
        filters.ethicalRating !== "all" &&
        media.evaluationRating !== filters.ethicalRating
      ) {
        console.log("⛔ exclu (éthique)", media.title, media.evaluationRating);
        return false;
      }
      return true;
    });

    console.log(
      "Résultat filtre type =",
      filters.mediaType,
      "|  total =",
      filtered.length,
      "|  movies =",
      filtered.filter((m) => m.mediaType === "movie").length,
      "|  tv =",
      filtered.filter((m) => m.mediaType === "tv").length
    );

    console.log("✅ gardés", filtered.length);

    console.groupEnd();

    setFilteredMedia(filtered);
    setPage(1);
    // setDisplayedMedia(filtered.slice(0, ITEMS_PER_PAGE));
  }, [evaluatedMedia, filters]);

  /* ────────────────────────────────────────────────────────────────── */
  /* REMISE EN HAUT LORS D'UN CHANGEMENT DE FILTRE                      */
  /* ────────────────────────────────────────────────────────────────── */
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [filters]);

  /* ────────────────────────────────────────────────────────────────── */
  /* LAZY‑LOAD / INFINITE SCROLL                                        */
  /* ────────────────────────────────────────────────────────────────── */
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (
        target.isIntersecting &&
        filteredMedia.length > displayedMedia.length
      ) {
        console.log("⏬ Intersection → page +1");
        setPage((prev) => prev + 1);
      }
    },
    [filteredMedia, displayedMedia]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      rootMargin: "600px 0px",
      threshold: 0,
    });
    const el = loaderRef.current;
    if (el) observer.observe(el);

    /* Nettoyage : on déconnecte totalement l'observer */
    return () => observer.disconnect();
  }, [handleObserver]);

  /* ────────────────────────────────────────────────────────────────── */
  /* RENDER                                                             */
  /* ────────────────────────────────────────────────────────────────── */
  return (
    <div className="pb-20">
      <PageHeader title="Avis">
        <Button
          onClick={handleRefresh}
          variant="outline"
          size="sm"
          disabled={isRefreshing || isEvaluationsLoading}
        >
          <RefreshCcw className="h-4 w-4 mr-2" />
          {isRefreshing || isEvaluationsLoading
            ? "Chargement..."
            : "Actualiser"}
        </Button>
      </PageHeader>

      <FilterPanel
        filters={filters}
        onFilterChange={(newFilters) => {
          console.log("🔄 Changement de filtre :", newFilters);
          setFilters({ ...newFilters });
        }}
        genres={genres}
        showUnrated={false}
        className="mb-6"
      />

      {/* États vides / feedback utilisateur */}
      {evaluations.length === 0 && (
        <div className="py-8 text-center">
          <p className="text-gray-500">
            Aucune évaluation disponible pour le moment
          </p>
        </div>
      )}

      {evaluations.length > 0 && displayedMedia.length === 0 && (
        <div className="py-8 text-center">
          <p className="text-gray-500">
            Aucune évaluation ne correspond aux critères de recherche
          </p>
        </div>
      )}

      {/* Grille principale */}
      {displayedMedia.length > 0 && (
        <MediaGrid
          items={displayedMedia}
          emptyMessage="Aucune évaluation ne correspond aux critères de recherche"
        />
      )}

      {/* Loader sentinelle pour l'Intersection Observer */}
      <div ref={loaderRef} className="h-1 w-full" />

      {/* Spinner quand il reste des éléments à charger */}
      {filteredMedia.length > displayedMedia.length && (
        <div className="py-8 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
        </div>
      )}
    </div>
  );
};

export default EvaluationsPage;
