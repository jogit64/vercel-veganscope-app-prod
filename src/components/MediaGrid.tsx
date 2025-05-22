import React from "react";
import { Media } from "@/types";
import MediaCard from "./MediaCard";

interface MediaGridProps {
  items: Media[];
  emptyMessage?: string;
}

const MediaGrid: React.FC<MediaGridProps> = ({
  items,
  emptyMessage = "Aucun contenu disponible",
}) => {
  // 📦 Log des IDs reçus pour vérifier le rerender
  console.log(
    "📦 MediaGrid items:",
    items.map((i) => i.id)
  );

  if (items.length === 0) {
    return <div className="py-8 text-center text-gray-500">{emptyMessage}</div>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {items.map((item, idx) => (
        <MediaCard key={`${item.mediaType}-${item.id}-${idx}`} media={item} />
      ))}
    </div>
  );
};

export default MediaGrid;
