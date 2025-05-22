
import React from 'react';
import { EthicalCriteria } from '@/types';

interface CriterionListProps {
  criteria: EthicalCriteria[];
  clickable?: boolean;
  onToggle?: (id: string, checked: boolean) => void;
}

const CriterionList: React.FC<CriterionListProps> = ({ 
  criteria, 
  clickable = false,
  onToggle
}) => {
  if (criteria.length === 0) return null;
  
  return (
    <div className="flex flex-wrap gap-1">
      {criteria.map(criterion => (
        <span 
          key={criterion.id}
          className={`inline-block bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded ${
            clickable ? 'cursor-pointer hover:bg-gray-200' : ''
          }`}
          onClick={clickable && onToggle ? () => onToggle(criterion.id, !criterion.checked) : undefined}
        >
          {criterion.label}
        </span>
      ))}
    </div>
  );
};

export default CriterionList;
