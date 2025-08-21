import { PostWithImage } from "../model/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { UserAvatar } from "@/entities/user/ui/user-avatar";
import { CommentSection } from "@/features/comments/ui/comments-section";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useFavoritesStore } from "@/shared/store/favorites-store";
import { cn } from "@/lib/utils";

interface PostCardProps {
  post: PostWithImage;
}

export function PostCard({ post }: PostCardProps) {
  const { isFavorite, toggleFavorite } = useFavoritesStore();

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(post.id);
  };

  return (
    <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="relative h-48 w-full">
        <Image
          src={post.imageUrl}
          alt={post.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={post.id <= 4}
        />

        {/* Кнопка избранного */}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute top-2 right-2 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm",
            isFavorite(post.id) && "text-red-500"
          )}
          onClick={handleFavoriteClick}
        >
          <Heart
            className={cn("h-4 w-4", isFavorite(post.id) ? "fill-current" : "")}
          />
        </Button>
      </div>

      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <UserAvatar userId={post.userId} />
          {isFavorite(post.id) && (
            <span className="text-xs text-muted-foreground">В избранном</span>
          )}
        </div>
        <CardTitle className="line-clamp-2 text-lg font-semibold">
          {post.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col h-full">
        <p className="line-clamp-3 text-sm text-muted-foreground flex-1 mb-4">
          {post.body}
        </p>

        <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
          <span>ID: {post.id}</span>
          <span>User: {post.userId}</span>
        </div>

        {/* Секция комментариев */}
        <CommentSection postId={post.id} />
      </CardContent>
    </Card>
  );
}
