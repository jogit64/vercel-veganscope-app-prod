
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  title: string;
  linkTo?: string;
  linkText?: string;
  className?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ 
  title, 
  linkTo, 
  linkText = 'Voir tout', 
  className 
}) => {
  return (
    <div className={cn('flex justify-between items-center mb-3', className)}>
      <h2 className="text-lg font-semibold">{title}</h2>
      {linkTo && (
        <Link to={linkTo} className="text-sm text-primary">
          {linkText}
        </Link>
      )}
    </div>
  );
};

export default SectionHeader;
