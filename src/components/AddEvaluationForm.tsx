import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EthicalCriteria, MediaEvaluation } from "@/types";

interface AddEvaluationFormProps {
  evaluation: {
    username: string;
    rating: string;
    comment: string;
    criteria: EthicalCriteria[];
  };
  onChange: (field: string, value: any) => void;
  onCriteriaChange: (id: string, checked: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

const AddEvaluationForm: React.FC<AddEvaluationFormProps> = ({
  evaluation,
  onChange,
  onCriteriaChange,
  onSubmit,
  isLoading,
}) => {
  return (
    <div className="p-4">
      <div className="mb-4">
        <h3 className="text-lg font-medium">Ajouter une évaluation</h3>
        <p className="text-sm text-gray-500">
          Partagez votre avis sur les aspects éthiques de ce contenu
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium mb-1">
            Votre pseudo *
          </label>
          <Input
            id="username"
            value={evaluation.username}
            onChange={(e) => onChange("username", e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="rating" className="block text-sm font-medium mb-1">
            Évaluation éthique *
          </label>
          <Select
            value={evaluation.rating}
            onValueChange={(value) => onChange("rating", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une évaluation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="green">🟢 Recommandé</SelectItem>
              <SelectItem value="yellow">🟡 Avec réserve</SelectItem>
              <SelectItem value="red">🔴 Non compatible</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label htmlFor="comment" className="block text-sm font-medium mb-1">
            Commentaire
          </label>
          <Textarea
            id="comment"
            value={evaluation.comment}
            onChange={(e) => onChange("comment", e.target.value)}
            rows={4}
          />
        </div>

        <div>
          <p className="block text-sm font-medium mb-2">
            Critères présents dans ce contenu
          </p>
          <div className="space-y-2">
            {evaluation.criteria.map((criterion) => (
              <div key={criterion.id} className="flex items-start space-x-2">
                <Checkbox
                  id={criterion.id}
                  checked={criterion.checked}
                  onCheckedChange={(checked) =>
                    onCriteriaChange(criterion.id, checked === true)
                  }
                />
                <div className="grid gap-0.5 leading-none">
                  <label
                    htmlFor={criterion.id}
                    className="text-sm font-medium leading-none cursor-pointer"
                  >
                    {criterion.label}
                  </label>
                  <p className="text-xs text-gray-500">
                    {criterion.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Enregistrement..." : "Publier mon évaluation"}
        </Button>
      </form>
    </div>
  );
};

export default AddEvaluationForm;
