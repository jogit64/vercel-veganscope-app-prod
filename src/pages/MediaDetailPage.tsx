import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "@/contexts/AppContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ethicalCriteriaOptions } from "@/data/mockData";
import { MediaEvaluation } from "@/types";
import { useMedia } from "@/hooks/useMedia";
import { useFavorites } from "@/hooks/useFavorites";
import { useEvaluations } from "@/hooks/useEvaluations";
import { fetchMediaDetails } from "@/lib/api";
import { Loader2 } from "lucide-react";

// Components
import MediaHeader from "@/components/MediaHeader";
import MediaOverview from "@/components/MediaOverview";
import EvaluationsTab from "@/components/EvaluationsTab";
import AddEvaluationForm from "@/components/AddEvaluationForm";

const MediaDetailPage: React.FC = () => {
  const { id, type } = useParams<{ id: string; type: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { genres } = useAppContext();

  const { getMediaById } = useMedia();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const {
    getEvaluationsForMedia,
    getRatingForMedia,
    addEvaluation,
    refreshEvaluations,
    isLoading: isEvaluationsLoading,
  } = useEvaluations();

  const mediaId = parseInt(id || "0");
  const mediaType = type === "movie" ? "movie" : "tv";

  const [media, setMedia] = useState(getMediaById(mediaId, mediaType));
  const [evaluations, setEvaluations] = useState<MediaEvaluation[]>([]);
  const [ethicalRating, setEthicalRating] = useState(
    getRatingForMedia(mediaId, mediaType)
  );
  const [isLoading, setIsLoading] = useState(!media);
  const favorite = isFavorite({ id: mediaId, type: mediaType });

  const [activeTab, setActiveTab] = useState("overview");

  const [newEvaluation, setNewEvaluation] = useState({
    username: "",
    rating: "",
    comment: "",
    criteria: [...ethicalCriteriaOptions],
  });

  useEffect(() => {
    const loadMediaDetails = async () => {
      if (!media && mediaId > 0) {
        setIsLoading(true);
        try {
          const details = await fetchMediaDetails(mediaId, mediaType);
          if (details) {
            const formattedMedia = {
              id: details.id,
              title: mediaType === "movie" ? details.title : details.name,
              overview: details.overview,
              posterPath: details.poster_path
                ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
                : null,
              backdropPath: details.backdrop_path
                ? `https://image.tmdb.org/t/p/original${details.backdrop_path}`
                : null,
              releaseDate: details.release_date,
              firstAirDate: details.first_air_date,
              genreIds: details.genres
                ? details.genres.map((g: any) => g.id)
                : [],
              mediaType: mediaType as "movie" | "tv",
            };
            setMedia(formattedMedia);
          }
        } catch (error) {
          console.error("Error fetching media details:", error);
          toast({
            title: "Erreur",
            description: "Impossible de charger les informations de ce contenu",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadMediaDetails();
  }, [mediaId, mediaType, media, toast]);

  useEffect(() => {
    if (mediaId && mediaType) {
      const mediaEvaluations = getEvaluationsForMedia(mediaId, mediaType);
      setEvaluations(mediaEvaluations);
      setEthicalRating(getRatingForMedia(mediaId, mediaType));
    }
  }, [mediaId, mediaType, getEvaluationsForMedia, getRatingForMedia]);

  if (isLoading) {
    return (
      <div className="py-8 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500 mx-auto" />
        <p className="mt-2 text-gray-500">Chargement...</p>
      </div>
    );
  }

  if (!media) {
    return (
      <div className="py-8 text-center">
        <p className="text-red-500 mb-4">Ce contenu n'a pas été trouvé</p>
        <button onClick={() => navigate(-1)}>Retour</button>
      </div>
    );
  }

  const handleBack = () => navigate(-1);

  const handleFavoriteToggle = () => {
    const favoriteItem = { id: mediaId, type: mediaType };
    if (favorite) {
      removeFavorite(favoriteItem);
      toast({
        title: "Retiré des favoris",
        description: `${media.title} a été retiré de vos favoris`,
      });
    } else {
      addFavorite(favoriteItem);
      toast({
        title: "Ajouté aux favoris",
        description: `${media.title} a été ajouté à vos favoris`,
      });
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Veganscope : ${media.title}`,
        text: `Découvrez l'évaluation éthique de ${media.title} sur Veganscope!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Lien copié!",
        description: "L'URL a été copiée dans votre presse-papier",
      });
    }
  };

  const handleRefreshEvaluations = async () => {
    await refreshEvaluations();
    const freshEvaluations = getEvaluationsForMedia(mediaId, mediaType);
    setEvaluations(freshEvaluations);
    toast({
      title: "Avis mis à jour",
      description: "Les avis ont été rafraîchis depuis la base de données",
    });
  };

  const handleEvaluationChange = (field: string, value: any) => {
    setNewEvaluation((prev) => ({ ...prev, [field]: value }));
  };

  const handleCriteriaChange = (id: string, checked: boolean) => {
    setNewEvaluation((prev) => ({
      ...prev,
      criteria: prev.criteria.map((c) => (c.id === id ? { ...c, checked } : c)),
    }));
  };

  const handleNewEvaluationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvaluation.username || !newEvaluation.rating) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    const evaluation: MediaEvaluation = {
      id: `new-${Date.now()}`,
      mediaId,
      mediaType,
      username: newEvaluation.username,
      rating: newEvaluation.rating as any,
      comment: newEvaluation.comment,
      criteria: newEvaluation.criteria,
      createdAt: new Date().toISOString(),
    };

    try {
      await addEvaluation(evaluation);
      setNewEvaluation({
        username: "",
        rating: "",
        comment: "",
        criteria: [...ethicalCriteriaOptions],
      });
      const updatedEvaluations = getEvaluationsForMedia(mediaId, mediaType);
      setEvaluations(updatedEvaluations);
      setActiveTab("evaluations");
    } catch (error) {
      console.error("Error adding evaluation:", error);
    }
  };

  const releaseYear = media.releaseDate
    ? new Date(media.releaseDate).getFullYear()
    : media.firstAirDate
    ? new Date(media.firstAirDate).getFullYear()
    : null;

  const mediaGenres = media.genreIds
    .map((genreId) => genres.find((g) => g.id === genreId)?.name)
    .filter(Boolean);

  return (
    <div className="pb-20">
      <MediaHeader
        media={media}
        onBack={handleBack}
        onShare={handleShare}
        onFavoriteToggle={handleFavoriteToggle}
        favorite={favorite}
        ethicalRating={ethicalRating}
      />

      <div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="overview">Présentation</TabsTrigger>
            <TabsTrigger value="evaluations">
              Avis
              {evaluations.length > 0 && (
                <span className="ml-1 bg-gray-200 text-gray-800 rounded-full w-5 h-5 inline-flex items-center justify-center text-xs">
                  {evaluations.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="addEvaluation">Évaluer</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="p-4">
            <MediaOverview
              media={media}
              releaseYear={releaseYear}
              mediaType={mediaType}
              mediaGenres={mediaGenres}
              ethicalRating={ethicalRating}
              evaluationsCount={evaluations.length}
              onViewEvaluations={() => setActiveTab("evaluations")}
            />
          </TabsContent>

          <TabsContent value="evaluations">
            <EvaluationsTab
              evaluations={evaluations}
              ethicalRating={ethicalRating}
              isLoading={isEvaluationsLoading}
              onRefresh={handleRefreshEvaluations}
              onAddEvaluation={() => setActiveTab("addEvaluation")}
            />
          </TabsContent>

          <TabsContent value="addEvaluation">
            <AddEvaluationForm
              evaluation={newEvaluation}
              onChange={handleEvaluationChange}
              onCriteriaChange={handleCriteriaChange}
              onSubmit={handleNewEvaluationSubmit}
              isLoading={isEvaluationsLoading}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MediaDetailPage;
