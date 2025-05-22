import React, { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EthicalRating } from "@/types";
import { cn } from "@/lib/utils";
import { genreIdToName } from "@/lib/utils";

// Définitions des années
const CURRENT_YEAR = new Date().getFullYear();
const yearOptions = ["Toutes les années"];
for (let year = CURRENT_YEAR; year >= 1900; year--) {
  yearOptions.push(year.toString());
}

// Types des filtres
export interface MediaFilters {
  mediaType: "all" | "movie" | "tv";
  genreId: number | null;
  year: string | null;
  ethicalRating: EthicalRating | "all";
}

interface FilterPanelProps {
  filters: MediaFilters;
  onFilterChange: (filters: MediaFilters) => void;
  genres?: { id: number; name: string }[];
  className?: string;
  hideMediaType?: boolean; // prop déjà existante
  showUnrated?: boolean; // nouvelle prop pour masquer « Non évalué »
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFilterChange,
  genres = [],
  className,
  hideMediaType = false,
  showUnrated = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Handle filter changes
  const handleTypeChange = (value: string) => {
    console.log("⚙️ Changement de type :", value);
    onFilterChange({
      ...filters,
      mediaType: value as "all" | "movie" | "tv",
    });
  };

  const handleGenreChange = (value: string) => {
    onFilterChange({
      ...filters,
      genreId: value === "null" ? null : parseInt(value, 10),
    });
  };

  const handleYearChange = (value: string) => {
    onFilterChange({
      ...filters,
      year: value === "Toutes les années" ? null : value,
    });
  };

  const handleRatingChange = (value: string) => {
    onFilterChange({
      ...filters,
      ethicalRating: value as EthicalRating | "all",
    });
  };

  return (
    <div className={cn("mb-4", className)}>
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="border rounded-md p-2"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span className="font-medium">Filtres</span>
          </div>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="p-1 h-auto">
              {isOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent className="pt-2">
          <div className="grid gap-4">
            {/* Type de média */}
            {!hideMediaType && (
              <div className="space-y-2">
                <Label className="text-xs font-medium">Type</Label>
                <RadioGroup
                  value={filters.mediaType}
                  onValueChange={handleTypeChange}
                  className="flex flex-wrap gap-2"
                >
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="all" id="all" />
                    <Label htmlFor="all" className="text-xs cursor-pointer">
                      Tous
                    </Label>
                  </div>
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="movie" id="movie" />
                    <Label htmlFor="movie" className="text-xs cursor-pointer">
                      Films
                    </Label>
                  </div>
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="tv" id="tv" />
                    <Label htmlFor="tv" className="text-xs cursor-pointer">
                      Séries
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            {/* Genre */}
            <div className="space-y-2">
              <Label htmlFor="genre" className="text-xs font-medium">
                Genre
              </Label>
              <Select
                value={filters.genreId?.toString() || "null"}
                onValueChange={handleGenreChange}
              >
                <SelectTrigger id="genre" className="text-xs h-8">
                  <SelectValue placeholder="Tous les genres" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="null" className="text-xs">
                    Tous les genres
                  </SelectItem>
                  {genres.map((genre) => (
                    <SelectItem
                      key={genre.id}
                      value={genre.id.toString()}
                      className="text-xs"
                    >
                      {genre.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Année */}
            <div className="space-y-2">
              <Label htmlFor="year" className="text-xs font-medium">
                Année de sortie
              </Label>
              <Select
                value={filters.year || "Toutes les années"}
                onValueChange={handleYearChange}
              >
                <SelectTrigger id="year" className="text-xs h-8">
                  <SelectValue placeholder="Toutes les années" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {yearOptions.map((year) => (
                    <SelectItem key={year} value={year} className="text-xs">
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Évaluation éthique */}
            <div className="space-y-2">
              <Label className="text-xs font-medium">
                Niveau d'évaluation éthique
              </Label>
              <RadioGroup
                value={filters.ethicalRating}
                onValueChange={handleRatingChange}
                className="flex flex-wrap gap-2"
              >
                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="all" id="rating-all" />
                  <Label
                    htmlFor="rating-all"
                    className="text-xs cursor-pointer"
                  >
                    Tous
                  </Label>
                </div>

                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="green" id="rating-green" />
                  <Label
                    htmlFor="rating-green"
                    className="text-xs cursor-pointer"
                  >
                    🟢 Recommandé
                  </Label>
                </div>

                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="yellow" id="rating-yellow" />
                  <Label
                    htmlFor="rating-yellow"
                    className="text-xs cursor-pointer"
                  >
                    🟡 Avec réserve
                  </Label>
                </div>

                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="red" id="rating-red" />
                  <Label
                    htmlFor="rating-red"
                    className="text-xs cursor-pointer"
                  >
                    🔴 Non compatible
                  </Label>
                </div>

                {/* option rendue seulement si showUnrated === true */}
                {showUnrated && (
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="unrated" id="rating-unrated" />
                    <Label
                      htmlFor="rating-unrated"
                      className="text-xs cursor-pointer"
                    >
                      ⚪️ Non évalué
                    </Label>
                  </div>
                )}
              </RadioGroup>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default FilterPanel;
