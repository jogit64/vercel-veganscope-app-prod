import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MediaEvaluation, EthicalCriteria } from "@/types";
import { useToast } from "./use-toast";

export const useSupabaseEvaluations = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fonction pour récupérer les évaluations depuis Supabase
  const fetchEvaluations = async (
    mediaId?: number,
    mediaType?: "movie" | "tv"
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("Fetching evaluations from Supabase...");
      let query = supabase.from("evaluations").select("*");

      // Si on a un mediaId et un mediaType, on filtre les résultats
      if (mediaId && mediaType) {
        const supabaseMediaType = mediaType === "movie" ? "film" : "série";
        query = query
          .eq("tmdb_id", mediaId.toString())
          .eq("media_type", supabaseMediaType);
      }

      const { data, error } = await query.order("created_at", {
        ascending: false,
      });

      if (error) {
        console.error("Supabase query error:", error);
        throw error;
      }

      console.log("Raw evaluations data:", data);

      if (!data || data.length === 0) {
        console.log("No evaluations found");
        return [];
      }

      // Convertir les données du format Supabase au format de notre application
      const evaluations: MediaEvaluation[] = data.map((item) => {
        // Convertir le niveau_ethique (vert, jaune, rouge) en EthicalRating (green, yellow, red)
        const ratingMap: Record<string, "green" | "yellow" | "red"> = {
          vert: "green",
          jaune: "yellow",
          rouge: "red",
        };

        // Convertir les critères du format JSON en tableau d'objets EthicalCriteria
        const criteriaArray: EthicalCriteria[] = Object.entries(
          item.criteres || {}
        ).map(([key, value]) => ({
          id: key,
          label: key,
          description: "", // Nous n'avons pas la description dans la base de données
          checked: Boolean(value),
        }));

        return {
          id: item.id,
          mediaId: parseInt(item.tmdb_id),
          mediaType: item.media_type === "film" ? "movie" : "tv",
          username: item.pseudo,
          rating: ratingMap[item.niveau_ethique] || "unrated",
          comment: item.commentaire || "",
          criteria: criteriaArray,
          createdAt: item.created_at,
        };
      });

      console.log("Processed evaluations:", evaluations);
      return evaluations;
    } catch (err) {
      console.error("Erreur lors de la récupération des avis:", err);
      setError("Impossible de récupérer les avis");
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour ajouter une évaluation à Supabase
  const addEvaluation = async (evaluation: MediaEvaluation) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("Adding evaluation to Supabase:", evaluation);

      // Convertir l'évaluation du format de l'application au format Supabase
      const ratingMap: Record<string, string> = {
        green: "vert",
        yellow: "jaune",
        red: "rouge",
      };

      // Convertir les critères en format JSON
      const criteres = evaluation.criteria.reduce((acc, criterion) => {
        acc[criterion.id] = criterion.checked;
        return acc;
      }, {} as Record<string, boolean>);

      const newEvaluation = {
        tmdb_id: evaluation.mediaId.toString(),
        pseudo: evaluation.username,
        niveau_ethique: ratingMap[evaluation.rating] || "vert",
        commentaire:
          evaluation.comment.trim() === "" ? null : evaluation.comment.trim(), // ← on envoie null si vide
        media_type: evaluation.mediaType === "movie" ? "film" : "série",
        criteres: criteres,
      };

      console.log("Formatted evaluation for Supabase:", newEvaluation);

      const { data, error } = await supabase
        .from("evaluations")
        .insert(newEvaluation)
        .select();

      if (error) {
        console.error("Supabase insert error:", error);
        throw error;
      }

      console.log("Supabase insert response:", data);

      toast({
        title: "Évaluation ajoutée",
        description: "Votre évaluation a été enregistrée avec succès",
      });

      // Retourner l'évaluation pour mise à jour de l'état local
      return evaluation;
    } catch (err) {
      console.error("Erreur lors de l'ajout de l'évaluation:", err);
      setError("Impossible d'ajouter votre évaluation");

      toast({
        title: "Erreur",
        description: "Impossible d'ajouter votre évaluation",
        variant: "destructive",
      });

      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { fetchEvaluations, addEvaluation, isLoading, error };
};
