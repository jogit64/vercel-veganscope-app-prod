import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Tv, Film, MessageSquare } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  linkTo?: string;
  linkText?: string;
  className?: string;
  icon?: "tv" | "film" | "comment";
}

const iconMap = {
  tv: <Tv className="w-5 h-5 text-gray-500 mr-2" />,
  film: <Film className="w-5 h-5 text-gray-500 mr-2" />,
  comment: <MessageSquare className="w-5 h-5 text-gray-500 mr-2" />,
};

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  linkTo,
  linkText = "Voir tout",
  className,
  icon,
}) => {
  return (
    <div className={cn("flex justify-between items-center mb-3", className)}>
      <div className="flex items-center">
        {icon && iconMap[icon]}
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      {linkTo && (
        <Link to={linkTo} className="text-sm text-primary">
          {linkText}
        </Link>
      )}
    </div>
  );
};

export default SectionHeader;
