import React from "react";
import { Link } from "react-router-dom";
import { Media } from "@/types";
import { useEvaluations } from "@/hooks/useEvaluations";
import { useFavorites } from "@/hooks/useFavorites";
import EthicalBadge from "./EthicalBadge";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface MediaCardProps {
  media: Media;
}

const MediaCard: React.FC<MediaCardProps> = ({ media }) => {
  const { getRatingForMedia } = useEvaluations();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

  const rating =
    media.evaluationRating || getRatingForMedia(media.id, media.mediaType);

  const favoriteItem = { id: media.id, type: media.mediaType };
  const favorite = isFavorite(favoriteItem);

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    favorite ? removeFavorite(favoriteItem) : addFavorite(favoriteItem);
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "Date inconnue";
    try {
      return format(new Date(dateString), "dd MMM yyyy", { locale: fr });
    } catch {
      return "Date invalide";
    }
  };

  const releaseDate = media.releaseDate || media.firstAirDate;

  return (
    <Link
      to={`/${media.mediaType}/${media.id}`}
      className="media-card hover:shadow-lg transition-shadow duration-200"
      aria-label={`Voir les détails de ${media.title}`}
    >
      <div className="relative">
        <div className="h-48 bg-gray-200 dark:bg-gray-700">
          {media.posterPath ? (
            <img
              src={media.posterPath}
              alt={media.title}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
              <span className="text-gray-400 dark:text-gray-500">
                Image non disponible
              </span>
            </div>
          )}
        </div>
        <button
          onClick={handleFavoriteToggle}
          className="absolute top-2 right-2 p-1.5 bg-white/80 rounded-full hover:bg-white dark:hover:bg-gray-300 transition-colors"
          type="button"
          aria-label={favorite ? "Retirer des favoris" : "Ajouter aux favoris"}
        >
          <Heart
            className={cn(
              "h-4 w-4",
              favorite ? "fill-vegan-purple text-vegan-purple" : "text-gray-500"
            )}
          />
        </button>
        <div className="absolute bottom-2 left-2 z-10">
          <EthicalBadge rating={rating} size="sm" />
        </div>
      </div>
      <div className="p-3 flex-grow flex flex-col justify-between bg-white dark:bg-gray-800 rounded-b-lg">
        <div>
          <h3 className="font-semibold text-sm line-clamp-1 text-foreground dark:text-white">
            {media.title}
          </h3>
          <p className="text-xs mt-1 text-muted-foreground">
            {formatDate(releaseDate)}
          </p>
        </div>
        <p className="text-xs line-clamp-2 mt-2 text-muted-foreground">
          {media.overview}
        </p>
      </div>
    </Link>
  );
};

export default React.memo(MediaCard);
