import { supabase } from "@/integrations/supabase/client";

interface TMDbParams {
  page?: number;
  with_genres?: string;
  year?: string;
  sort_by?: string;
  language?: string;
  // ❌ plus besoin :
  // first_air_date_gte?: string;
  // first_air_date_lte?: string;
}

export async function fetchTrendingMovies(params: TMDbParams = {}) {
  try {
    const {
      page = 1,
      with_genres,
      year,
      //sort_by = "popularity.desc",
      sort_by = "popularity.desc",
      language = "fr-FR",
    } = params;

    console.log("Fetching movies with params:", { ...params, language });

    const { data, error } = await supabase.functions.invoke("tmdb-api", {
      body: {
        endpoint: "/discover/movie",
        params: {
          page,
          with_genres,
          year,
          sort_by,
          language,
          include_adult: false,
          per_page: 10, // Only show 10 items per page
        },
      },
    });

    if (error) {
      throw new Error(`Failed to fetch movies: ${error.message}`);
    }

    console.log("Movies API response:", data);
    return data;
  } catch (error) {
    console.error("Error fetching movies:", error);
    return { results: [], page: 1, total_pages: 0, total_results: 0 };
  }
}

// Fonction utilitaire pour filtrer les titres sans caractères occidentaux
function isTitleReadable(title: string): boolean {
  // Vérifie s'il y a au moins une lettre latine (a-z, A-Z, lettres accentuées)
  return /[A-Za-zÀ-ÿ]/.test(title);
}

// src/lib/api.ts
export async function fetchTrendingTVSeries(params: TMDbParams = {}) {
  try {
    const {
      page = 1,
      with_genres,
      year,
      // sort_by = "first_air_date.desc",
      sort_by = "popularity.desc",
      language = "fr-FR",
    } = params;

    const PAGE_SIZE = 20; // taille cible
    const currentYear = new Date().getFullYear();
    const today = new Date().toISOString().split("T")[0];
    const selectedYear = year ?? currentYear;

    const dateParams =
      year !== undefined
        ? {
            "first_air_date.gte": `${selectedYear}-01-01`,
            "first_air_date.lte":
              selectedYear === currentYear ? today : `${selectedYear}-12-31`,
          }
        : {
            "first_air_date.gte": "2015-01-01",
            "first_air_date.lte": today,
          };

    let currentPage = page;
    let validItems: any[] = [];
    let lastTotalPages = 1;

    while (validItems.length < PAGE_SIZE && currentPage <= 20) {
      const { data, error } = await supabase.functions.invoke("tmdb-api", {
        body: {
          endpoint: "/discover/tv",
          params: {
            page: currentPage,
            with_genres,
            sort_by,
            language,
            ...dateParams,
            include_adult: false,
            per_page: PAGE_SIZE,
          },
        },
      });

      if (error) throw new Error(error.message);

      lastTotalPages = data?.total_pages ?? currentPage;

      const filtered = (data?.results ?? []).filter((item: any) => {
        const hasPoster = !!item.poster_path;
        const readable = /[A-Za-zÀ-ÿ]/.test(item.name || item.title || "");
        return hasPoster && readable;
      });

      validItems.push(...filtered);
      currentPage++;

      if (currentPage > lastTotalPages) break; // plus de pages côté TMDb
    }

    /* on renvoie EXACTEMENT 20 éléments (ou moins si TMDb est épuisé) */
    const sliced = validItems.slice(0, PAGE_SIZE);

    /* encore des pages si on n’est pas allé au bout du catalogue TMDb */
    const hasMore = currentPage <= lastTotalPages;

    return { page, results: sliced, hasMore };
  } catch (err) {
    console.error(err);
    return { page: 1, results: [], hasMore: false };
  }
}

export async function fetchMediaDetails(id: number, mediaType: "movie" | "tv") {
  try {
    console.log(`Fetching ${mediaType} details for ID:`, id);

    const { data, error } = await supabase.functions.invoke("tmdb-api", {
      body: {
        endpoint: `/${mediaType}/${id}`,
        params: {
          language: "fr-FR",
          append_to_response: "credits,similar",
        },
      },
    });

    if (error) {
      throw new Error(`Failed to fetch ${mediaType} details: ${error.message}`);
    }

    console.log(`${mediaType} details API response:`, data);
    return data;
  } catch (error) {
    console.error(`Error fetching ${mediaType} details:`, error);
    return null;
  }
}

export async function searchMedia(query: string, page: number = 1) {
  try {
    console.log(`Searching for: "${query}", page: ${page}`);

    const { data, error } = await supabase.functions.invoke("tmdb-api", {
      body: {
        endpoint: "/search/multi",
        params: {
          query,
          page,
          language: "fr-FR",
          include_adult: false,
        },
      },
    });

    if (error) {
      throw new Error(`Failed to search media: ${error.message}`);
    }

    console.log("Search API response:", data);
    return data;
  } catch (error) {
    console.error("Error searching media:", error);
    return { results: [], page: 1, total_pages: 0, total_results: 0 };
  }
}

// Fonction pour récupérer les genres de films
export async function fetchMovieGenres() {
  try {
    console.log("Fetching movie genres");

    const { data, error } = await supabase.functions.invoke("tmdb-api", {
      body: {
        endpoint: "/genre/movie/list",
        params: {
          language: "fr-FR",
        },
      },
    });

    if (error) {
      throw new Error(`Failed to fetch movie genres: ${error.message}`);
    }

    console.log("Movie genres API response:", data);
    return data.genres || [];
  } catch (error) {
    console.error("Error fetching movie genres:", error);
    return [];
  }
}

// Nouvelle fonction pour récupérer les genres de séries TV
export async function fetchTvGenres() {
  try {
    console.log("Fetching TV genres");

    const { data, error } = await supabase.functions.invoke("tmdb-api", {
      body: {
        endpoint: "/genre/tv/list",
        params: {
          language: "fr-FR",
        },
      },
    });

    if (error) {
      throw new Error(`Failed to fetch TV genres: ${error.message}`);
    }

    console.log("TV genres API response:", data);
    return data.genres || [];
  } catch (error) {
    console.error("Error fetching TV genres:", error);
    return [];
  }
}
