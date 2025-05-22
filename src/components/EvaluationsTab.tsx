import React from "react";
import { Button } from "@/components/ui/button";
import EthicalBadge from "@/components/EthicalBadge";
import { RefreshCcw } from "lucide-react";
import { MediaEvaluation, EthicalRating } from "@/types";
import EvaluationCard from "./EvaluationCard";

interface EvaluationsTabProps {
  evaluations: MediaEvaluation[];
  ethicalRating: EthicalRating;
  isLoading: boolean;
  onRefresh: () => void;
  onAddEvaluation: () => void;
}

const EvaluationsTab: React.FC<EvaluationsTabProps> = ({
  evaluations,
  ethicalRating,
  isLoading,
  onRefresh,
  onAddEvaluation,
}) => {
  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-medium">Évaluations</h3>
          <div className="flex items-center gap-2">
            <EthicalBadge rating={ethicalRating} />
            <span className="text-sm">
              {evaluations.length} évaluation
              {evaluations.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isLoading}
        >
          <RefreshCcw className="h-4 w-4 mr-2" />
          {isLoading ? "Chargement..." : "Actualiser"}
        </Button>
      </div>

      {evaluations.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-gray-500 mb-2">Aucune évaluation pour l'instant</p>
          <Button onClick={onAddEvaluation}>Ajouter une évaluation</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {evaluations.map((evaluation) => (
            <EvaluationCard key={evaluation.id} evaluation={evaluation} />
          ))}
        </div>
      )}
    </div>
  );
};

export default EvaluationsTab;
