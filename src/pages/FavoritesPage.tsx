import React, { useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";
import MediaGrid from "@/components/MediaGrid";
import FilterPanel, { MediaFilters } from "@/components/FilterPanel";
import { useFavorites } from "@/hooks/useFavorites";
import { useEvaluations } from "@/hooks/useEvaluations";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Media } from "@/types";
import { fetchMediaDetails } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { allGenres } from "@/lib/utils";

const FavoritesPage: React.FC = () => {
  const { favorites } = useFavorites();
  const { evaluations } = useEvaluations();
  const [favoriteMedia, setFavoriteMedia] = useState<Media[]>([]);
  const [filteredMedia, setFilteredMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<MediaFilters>({
    mediaType: "all",
    genreId: null,
    year: null,
    ethicalRating: "all",
  });

  useEffect(() => {
    const fetchFavorites = async () => {
      if (favorites.length === 0) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const mediaPromises = favorites.map(async (id) => {
          let media = await fetchMediaDetails(id, "movie");
          if (!media) media = await fetchMediaDetails(id, "tv");
          if (!media) return null;

          const mediaType = media.title ? "movie" : "tv";

          const evaluation = evaluations.find(
            (e) => e.mediaId === media.id && e.mediaType === mediaType
          );

          return {
            id: media.id,
            title: media.title || media.name,
            overview: media.overview,
            posterPath: media.poster_path
              ? `https://image.tmdb.org/t/p/w500${media.poster_path}`
              : null,
            backdropPath: media.backdrop_path
              ? `https://image.tmdb.org/t/p/original${media.backdrop_path}`
              : null,
            releaseDate: media.release_date,
            firstAirDate: media.first_air_date,
            genreIds: media.genres ? media.genres.map((g) => g.id) : [],
            mediaType,
            evaluationRating: evaluation ? evaluation.rating : "unrated", // ✅ ajouté ici
          } as Media;
        });

        const results = await Promise.all(mediaPromises);
        const validMedia = results.filter((media) => media !== null) as Media[];
        setFavoriteMedia(validMedia);
      } catch (err) {
        console.error("Error fetching favorite media:", err);
        setError("Une erreur est survenue lors du chargement de vos favoris");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [favorites, evaluations]);

  useEffect(() => {
    let filtered = [...favoriteMedia];

    if (filters.mediaType !== "all") {
      filtered = filtered.filter(
        (item) => item.mediaType === filters.mediaType
      );
    }

    if (filters.genreId !== null) {
      filtered = filtered.filter((item) =>
        item.genreIds.includes(filters.genreId!)
      );
    }

    if (filters.year) {
      filtered = filtered.filter((item) => {
        const date = item.releaseDate || item.firstAirDate;
        return date ? date.startsWith(filters.year!) : false;
      });
    }

    if (filters.ethicalRating !== "all") {
      filtered = filtered.filter(
        (item) => item.evaluationRating === filters.ethicalRating
      );
    }

    setFilteredMedia(filtered);
  }, [favoriteMedia, filters]);

  const handleFilterChange = (newFilters: MediaFilters) => {
    setFilters(newFilters);
  };

  if (loading) {
    return (
      <div className="pb-20">
        <PageHeader title="Favoris" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-5 w-3/4 mt-2" />
              <Skeleton className="h-4 w-1/2 mt-2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pb-20">
        <PageHeader title="Favoris" />
        <div className="py-8 text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button asChild>
            <Link to="/">Retour à l'accueil</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      <PageHeader title="Favoris" />

      {favoriteMedia.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-gray-500 mb-4">
            Vous n'avez pas encore ajouté de favoris
          </p>
          <Button asChild>
            <Link to="/">Découvrir des contenus</Link>
          </Button>
        </div>
      ) : (
        <>
          <FilterPanel
            filters={filters}
            onFilterChange={handleFilterChange}
            genres={allGenres}
          />

          <MediaGrid
            items={filteredMedia}
            emptyMessage={
              favoriteMedia.length > 0 && filteredMedia.length === 0
                ? "Aucun favori ne correspond aux filtres sélectionnés"
                : "Vous n'avez pas encore ajouté de favoris"
            }
          />
        </>
      )}
    </div>
  );
};

export default FavoritesPage;
