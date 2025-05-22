
import React from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  className?: string;
}

const PageHeader: React.FC<React.PropsWithChildren<PageHeaderProps>> = ({ title, className, children }) => {
  return (
    <div className={cn('flex items-center justify-between py-4', className)}>
      <h1 className="text-xl font-bold">{title}</h1>
      {children}
    </div>
  );
};

export default PageHeader;
