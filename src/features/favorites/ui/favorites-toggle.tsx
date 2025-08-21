"use client";

import { Button } from "@/components/ui/button";
import { useFavoritesStore } from "@/shared/store/favorites-store";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface FavoritesToggleProps {
  showFavorites: boolean;
  onToggle: (showFavorites: boolean) => void;
}

export function FavoritesToggle({
  showFavorites,
  onToggle,
}: FavoritesToggleProps) {
  const { favorites } = useFavoritesStore();

  return (
    <div className="flex items-center space-x-2 mb-6">
      <Button
        variant={showFavorites ? "outline" : "default"}
        onClick={() => onToggle(false)}
        className={cn(
          "flex items-center",
          !showFavorites && "bg-primary text-primary-foreground"
        )}
      >
        Все посты
      </Button>

      <Button
        variant={showFavorites ? "default" : "outline"}
        onClick={() => onToggle(true)}
        className={cn(
          "flex items-center",
          showFavorites && "bg-primary text-primary-foreground"
        )}
      >
        <Star className="h-4 w-4 mr-2" />
        Избранные ({favorites.length})
      </Button>
    </div>
  );
}
