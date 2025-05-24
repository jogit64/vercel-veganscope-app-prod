import { useState, useEffect, createContext, useContext } from "react";

// Nouveau type favori : inclut l'ID et le type du média
interface FavoriteItem {
  id: number;
  type: "movie" | "tv";
}

interface FavoritesContextProps {
  favorites: FavoriteItem[];
  addFavorite: (item: FavoriteItem) => void;
  removeFavorite: (item: FavoriteItem) => void;
  isFavorite: (item: FavoriteItem) => boolean;
}

const FavoritesContext = createContext<FavoritesContextProps | undefined>(
  undefined
);

export const useFavoritesContext = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error(
      "useFavoritesContext must be used within a FavoritesProvider"
    );
  }
  return context;
};

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  // Chargement depuis localStorage au démarrage
  useEffect(() => {
    const storedFavorites = localStorage.getItem("veganscope_favorites");
    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites));
      } catch (e) {
        console.error("Error loading favorites:", e);
      }
    }
  }, []);

  // Sauvegarde à chaque changement
  useEffect(() => {
    localStorage.setItem("veganscope_favorites", JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (item: FavoriteItem) => {
    setFavorites((prev) => {
      const exists = prev.some(
        (fav) => fav.id === item.id && fav.type === item.type
      );
      return exists ? prev : [...prev, item];
    });
  };

  const removeFavorite = (item: FavoriteItem) => {
    setFavorites((prev) =>
      prev.filter((fav) => !(fav.id === item.id && fav.type === item.type))
    );
  };

  const isFavorite = (item: FavoriteItem | number): boolean => {
    console.log("🔍 Checking favorite for:", item);
    if (typeof item === "number") {
      console.warn("⚠️ isFavorite appelé avec un ID seul sans type !");
      // Optionnel : retourne false ou recherche partielle
      return favorites.some((fav) => fav.id === item);
    }

    return favorites.some(
      (fav) => fav.id === item.id && fav.type === item.type
    );
  };

  const value = {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
  };
  console.log("💾 favorites in context:", favorites);

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  return {
    ...useFavoritesContext(),
  };
};
