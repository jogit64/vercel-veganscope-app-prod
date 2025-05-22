
import React from 'react';
import { EthicalRating } from '@/types';
import { cn } from '@/lib/utils';

interface EthicalBadgeProps {
  rating: EthicalRating;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const badgeLabels = {
  green: '🟢 Recommandé',
  yellow: '🟡 Avec réserve',
  red: '🔴 Non compatible',
  unrated: '⚪️ Non évalué'
};

const EthicalBadge: React.FC<EthicalBadgeProps> = ({ 
  rating, 
  size = 'md', 
  showLabel = true 
}) => {
  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-xs px-2 py-1',
    lg: 'text-sm px-2.5 py-1.5',
  };

  const getBadgeClasses = () => {
    const baseClasses = "rounded-full font-medium shadow-sm bg-opacity-90";
    
    switch (rating) {
      case 'green':
        return "bg-green-100 text-green-800 border border-green-200";
      case 'yellow':
        return "bg-amber-100 text-amber-800 border border-amber-200";
      case 'red':
        return "bg-red-100 text-red-800 border border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-200";
    }
  };

  return (
    <span className={cn(
      "inline-flex items-center gap-1 whitespace-nowrap", 
      getBadgeClasses(), 
      sizeClasses[size]
    )}>
      {showLabel && <span>{badgeLabels[rating]}</span>}
    </span>
  );
};

export default EthicalBadge;
