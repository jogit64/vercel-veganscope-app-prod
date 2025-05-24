import React, { useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";
import SearchBar from "@/components/SearchBar";
import MediaGrid from "@/components/MediaGrid";
import FilterPanel, { MediaFilters } from "@/components/FilterPanel";
import { useLocation } from "react-router-dom";
import { searchMedia } from "@/lib/api";
import { Media } from "@/types";
import { useEvaluations } from "@/hooks/useEvaluations";
import { Skeleton } from "@/components/ui/skeleton";
import { allGenres } from "@/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useMediaFiltering } from "@/hooks/useMediaFiltering";

const SearchPage: React.FC = () => {
  const [results, setResults] = useState<Media[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const { getRatingForMedia } = useEvaluations();

  // Initialisation des filtres (tous activés par défaut pour les résultats de recherche)
  const initialFilters: MediaFilters = {
    mediaType: "all",
    genreId: null,
    year: null,
    ethicalRating: "all",
  };

  // Utilisation du hook de filtrage centralisé
  const {
    filters,
    filteredItems: filteredResults,
    handleFilterChange,
  } = useMediaFiltering(results, initialFilters);

  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q") || "";

  useEffect(() => {
    if (!query) return;

    const performSearch = async () => {
      setIsSearching(true);
      setError(null);

      try {
        const data = await searchMedia(query, currentPage);

        if (!data || !data.results) {
          throw new Error("Réponse de recherche invalide");
        }

        // Convert TMDb results to our Media type
        const mediaResults: Media[] = data.results
          .filter(
            (item) => item.media_type === "movie" || item.media_type === "tv"
          )
          .map((item) => ({
            id: item.id,
            title: item.title || item.name || "Sans titre",
            overview: item.overview || "Aucune description disponible",
            posterPath: item.poster_path
              ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
              : null,
            backdropPath: item.backdrop_path
              ? `https://image.tmdb.org/t/p/original${item.backdrop_path}`
              : null,
            releaseDate: item.release_date || null,
            firstAirDate: item.first_air_date || null,
            genreIds: item.genre_ids || [],
            mediaType: item.media_type as "movie" | "tv",
            // Get ethical rating for each result
            evaluationRating: getRatingForMedia(item.id, item.media_type),
          }));

        setResults(mediaResults);
        setTotalPages(
          data.total_pages > 0 ? Math.min(data.total_pages, 20) : 0
        ); // Limit to 20 pages max
      } catch (err) {
        console.error("Error during search:", err);
        setError("Une erreur est survenue lors de la recherche");
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    performSearch();
  }, [query, currentPage, getRatingForMedia]);

  // Reset to page 1 when new search query
  useEffect(() => {
    setCurrentPage(1);
  }, [query]);

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <Pagination className="mt-8">
        <PaginationContent>
          {currentPage > 1 && (
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                className="cursor-pointer"
              />
            </PaginationItem>
          )}

          {[...Array(Math.min(5, totalPages))].map((_, i) => {
            // Show pages around current page
            let pageToShow = currentPage - 2 + i;

            // Adjust if we're at the start
            if (currentPage < 3) {
              pageToShow = i + 1;
            }
            // Adjust if we're at the end
            else if (currentPage > totalPages - 2) {
              pageToShow = totalPages - 4 + i;
            }

            // Make sure page is in valid range
            if (pageToShow > 0 && pageToShow <= totalPages) {
              return (
                <PaginationItem key={pageToShow}>
                  <PaginationLink
                    isActive={pageToShow === currentPage}
                    onClick={() => setCurrentPage(pageToShow)}
                    className="cursor-pointer"
                  >
                    {pageToShow}
                  </PaginationLink>
                </PaginationItem>
              );
            }
            return null;
          })}

          {currentPage < totalPages && (
            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                className="cursor-pointer"
              />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    );
  };

  const renderSearchContent = () => {
    if (isSearching) {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="flex flex-col">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-5 w-3/4 mt-2" />
              <Skeleton className="h-4 w-1/2 mt-2" />
            </div>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-8">
          <p className="text-destructive">{error}</p>
        </div>
      );
    }

    return (
      <>
        <MediaGrid
          items={filteredResults}
          emptyMessage={
            results.length > 0 && filteredResults.length === 0
              ? "Aucun résultat ne correspond aux filtres sélectionnés"
              : `Aucun résultat pour "${query}"`
          }
        />
        {renderPagination()}
      </>
    );
  };

  return (
    <div className="pb-20">
      <div className="mb-6 pt-4">
        <div className="flex items-start gap-3 px-4 py-4 bg-card text-card-foreground border border-border rounded-xl shadow-md">
          <PageHeader
            title="Résultats"
            icon="search"
            description="Résultats correspondant à votre recherche"
          />
        </div>
      </div>

      <div className="mb-6">
        <SearchBar placeholder="Rechercher à nouveau..." />
      </div>

      {query ? (
        <>
          <h2 className="text-lg font-medium mb-4">Résultats pour "{query}"</h2>

          {results.length > 0 && !isSearching && (
            <FilterPanel
              filters={filters}
              onFilterChange={handleFilterChange}
              genres={allGenres}
            />
          )}

          {renderSearchContent()}
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            Utilisez la barre de recherche ci-dessus
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
