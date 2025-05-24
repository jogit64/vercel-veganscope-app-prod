import React from "react";
import { cn } from "@/lib/utils";
import { Tv, Film, Star, Search, MessageSquare } from "lucide-react";

interface PageHeaderProps {
  title: string;
  children?: React.ReactNode;
  className?: string;
  icon?: "tv" | "film" | "star" | "search" | "comment";
  description?: string; // 👈 AJOUT ICI
}

const iconMap = {
  tv: <Tv className="w-6 h-6 text-muted-foreground mr-2" />,
  film: <Film className="w-6 h-6 text-gray-600 mr-2" />,
  star: <Star className="w-6 h-6 text-gray-600 mr-2" />,
  search: <Search className="w-6 h-6 text-gray-600 mr-2" />,
  comment: <MessageSquare className="w-6 h-6 text-gray-600 mr-2" />,
};

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  children,
  className,
  icon,
  description,
}) => {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center">
          {icon && iconMap[icon]}
          <h1 className="text-xl font-bold text-foreground">{title}</h1>
        </div>
        {children}
      </div>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
};

export default PageHeader;
