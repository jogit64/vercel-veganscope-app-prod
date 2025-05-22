
import React from 'react';
import EthicalBadge from '@/components/EthicalBadge';
import CriterionList from '@/components/CriterionList';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { MediaEvaluation, EthicalRating } from '@/types';

interface EvaluationCardProps {
  evaluation: MediaEvaluation;
}

const EvaluationCard: React.FC<EvaluationCardProps> = ({ evaluation }) => {
  return (
    <div className="border rounded-lg p-4 bg-white">
      <div className="flex items-start justify-between mb-3">
        <div className="font-medium">{evaluation.username}</div>
        <EthicalBadge rating={evaluation.rating} />
      </div>
      
      <div className="mb-3">
        <p className="text-sm">{evaluation.comment}</p>
      </div>
      
      {evaluation.criteria.filter(c => c.checked).length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-medium mb-1">Critères:</p>
          <CriterionList criteria={evaluation.criteria.filter(c => c.checked)} />
        </div>
      )}
      
      <div className="text-xs text-gray-500">
        {format(new Date(evaluation.createdAt), 'dd MMMM yyyy', { locale: fr })}
      </div>
    </div>
  );
};

export default EvaluationCard;
