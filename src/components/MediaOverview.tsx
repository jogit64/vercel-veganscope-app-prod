import React from "react";
import EthicalBadge from "@/components/EthicalBadge";
import { Button } from "@/components/ui/button";
import { Media, EthicalRating } from "@/types";

interface MediaOverviewProps {
  media: Media;
  releaseYear: number | null;
  mediaType: string;
  mediaGenres: (string | undefined)[];
  ethicalRating: EthicalRating;
  evaluationsCount: number;
  onViewEvaluations: () => void;
}

const MediaOverview: React.FC<MediaOverviewProps> = ({
  media,
  releaseYear,
  mediaType,
  mediaGenres,
  ethicalRating,
  evaluationsCount,
  onViewEvaluations,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold mb-1">{media.title}</h2>
        <div className="flex items-center text-xs text-gray-500 space-x-2">
          {releaseYear && <span>{releaseYear}</span>}
          <span>•</span>
          <span>{mediaType === "movie" ? "Film" : "Série"}</span>
          {mediaGenres.length > 0 && (
            <>
              <span>•</span>
              <span>{mediaGenres.join(", ")}</span>
            </>
          )}
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-1">Synopsis</h3>
        <p className="text-sm">{media.overview}</p>
      </div>

      <div>
        <h3 className="font-medium mb-1">Évaluation éthique</h3>
        <div className="flex items-center gap-2 mb-2">
          <EthicalBadge rating={ethicalRating} />
          <span className="text-sm">
            {evaluationsCount} évaluation{evaluationsCount !== 1 ? "s" : ""}
          </span>
        </div>

        {ethicalRating === "unrated" ? (
          <p className="text-sm text-gray-500">
            Ce contenu n'a pas encore été évalué. Soyez le premier à donner
            votre avis!
          </p>
        ) : (
          <Button
            variant="link"
            className="p-0 h-auto text-primary"
            onClick={onViewEvaluations}
          >
            Voir les avis
          </Button>
        )}
      </div>
    </div>
  );
};

export default MediaOverview;
