import { useState, useEffect } from "react";
import { createContext, useContext } from "react";
import { useSupabaseEvaluations } from "@/hooks/useSupabaseEvaluations";
import { useToast } from "@/hooks/use-toast";
import { MediaEvaluation, EthicalRating } from "@/types";

interface EvaluationsContextProps {
  evaluations: MediaEvaluation[];
  addEvaluation: (
    evaluation: MediaEvaluation
  ) => Promise<MediaEvaluation | null>;
  getEvaluationsForMedia: (
    id: number,
    mediaType: "movie" | "tv"
  ) => MediaEvaluation[];
  getRatingForMedia: (id: number, mediaType: "movie" | "tv") => EthicalRating;
  refreshEvaluations: () => Promise<MediaEvaluation[]>;
  isLoading: boolean;
}

const EvaluationsContext = createContext<EvaluationsContextProps | undefined>(
  undefined
);

export const useEvaluationsContext = () => {
  const context = useContext(EvaluationsContext);
  if (context === undefined) {
    throw new Error(
      "useEvaluationsContext must be used within an EvaluationsProvider"
    );
  }
  return context;
};

export const EvaluationsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [evaluations, setEvaluations] = useState<MediaEvaluation[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  const {
    fetchEvaluations,
    addEvaluation: addSupabaseEvaluation,
    isLoading: isSupabaseLoading,
  } = useSupabaseEvaluations();
  const { toast } = useToast();

  // Load initial evaluations
  useEffect(() => {
    console.log("Initial evaluations load");
    refreshEvaluations();
  }, []);

  // Refresh evaluations from Supabase
  const refreshEvaluations = async () => {
    try {
      console.log("Refreshing evaluations from Supabase");
      setIsLoadingData(true);
      const supabaseEvaluations = await fetchEvaluations();
      console.log("Received evaluations:", supabaseEvaluations);

      // Always use Supabase evaluations, fall back to empty array
      const evaluationsToSet = supabaseEvaluations || [];
      setEvaluations(evaluationsToSet);
      setIsLoadingData(false);
      return evaluationsToSet;
    } catch (error) {
      console.error("Error loading evaluations:", error);
      setIsLoadingData(false);
      toast({
        title: "Erreur",
        description: "Impossible de charger les avis",
        variant: "destructive",
      });
      return [];
    }
  };

  const addEvaluation = async (evaluation: MediaEvaluation) => {
    console.log("Adding evaluation:", evaluation);

    // Add to Supabase
    const result = await addSupabaseEvaluation(evaluation);

    if (result) {
      console.log("Evaluation added successfully:", result);

      // Update local state if Supabase add was successful
      setEvaluations((prev) => [result, ...prev]);

      toast({
        title: "Évaluation ajoutée",
        description: "Votre évaluation a été enregistrée avec succès",
      });

      return result;
    } else {
      console.error("Failed to add evaluation");
      return null;
    }
  };

  const getEvaluationsForMedia = (
    id: number,
    mediaType: "movie" | "tv"
  ): MediaEvaluation[] => {
    return evaluations.filter(
      (evaluation) =>
        evaluation.mediaId === id && evaluation.mediaType === mediaType
    );
  };

  const getRatingForMedia = (
    id: number,
    mediaType: "movie" | "tv"
  ): EthicalRating => {
    const mediaEvaluations = getEvaluationsForMedia(id, mediaType);

    if (mediaEvaluations.length === 0) return "unrated";

    const ratings = {
      green: 0,
      yellow: 0,
      red: 0,
    };

    mediaEvaluations.forEach((evaluation) => {
      if (evaluation.rating in ratings) {
        ratings[evaluation.rating as keyof typeof ratings] += 1;
      }
    });

    if (ratings.green > ratings.yellow && ratings.green > ratings.red)
      return "green";
    if (ratings.yellow > ratings.green && ratings.yellow > ratings.red)
      return "yellow";
    if (ratings.red > ratings.green && ratings.red > ratings.yellow)
      return "red";

    // In case of tie, prioritize by severity
    if (ratings.red > 0) return "red";
    if (ratings.yellow > 0) return "yellow";
    return "green";
  };

  const value = {
    evaluations,
    addEvaluation,
    getEvaluationsForMedia,
    getRatingForMedia,
    refreshEvaluations,
    isLoading: isLoadingData || isSupabaseLoading,
  };

  return (
    <EvaluationsContext.Provider value={value}>
      {children}
    </EvaluationsContext.Provider>
  );
};

// Hook to expose evaluations context in components that don't need to provide it
export const useEvaluations = () => {
  return {
    ...useEvaluationsContext(),
  };
};
