
import React from 'react';
import { ArrowLeft, Heart, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Media, EthicalRating } from '@/types';
import EthicalBadge from '@/components/EthicalBadge';
import { cn } from '@/lib/utils';

interface MediaHeaderProps {
  media: Media;
  onBack: () => void;
  onShare: () => void;
  onFavoriteToggle: () => void;
  favorite: boolean;
  ethicalRating: EthicalRating;
}

const MediaHeader: React.FC<MediaHeaderProps> = ({ 
  media, 
  onBack, 
  onShare, 
  onFavoriteToggle, 
  favorite,
  ethicalRating
}) => {
  return (
    <div className="relative">
      {/* Header with back button */}
      <div className="sticky top-0 z-10 bg-white border-b p-3 flex items-center">
        <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold truncate">{media.title}</h1>
      </div>
      
      {/* Media cover with ethical badge */}
      <div className="relative h-48 bg-gray-200">
        {media.backdropPath ? (
          <img 
            src={media.backdropPath} 
            alt={media.title}
            className="h-full w-full object-cover"
          />
        ) : media.posterPath ? (
          <img 
            src={media.posterPath} 
            alt={media.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-gray-100">
            <span className="text-gray-400">Image non disponible</span>
          </div>
        )}
        
        <div className="absolute bottom-3 left-3">
          <EthicalBadge rating={ethicalRating} size="lg" />
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="p-4 border-b flex justify-between">
        <Button 
          variant="outline" 
          onClick={onFavoriteToggle}
          className={cn(favorite && "text-primary border-primary")}
        >
          <Heart className={cn(
            "h-4 w-4 mr-2", 
            favorite && "fill-vegan-purple text-vegan-purple"
          )} />
          {favorite ? 'Dans vos favoris' : 'Ajouter aux favoris'}
        </Button>
        
        <Button variant="outline" onClick={onShare}>
          <Share2 className="h-4 w-4 mr-2" />
          Partager
        </Button>
      </div>
    </div>
  );
};

export default MediaHeader;
