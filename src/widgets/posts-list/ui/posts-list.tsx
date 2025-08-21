"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { PostCard } from "@/entities/post/ui/post-card";
import { Grid } from "@/shared/ui/grid";
import { postsApi } from "@/features/posts/api/posts-api";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { FavoritesToggle } from "@/features/favorites/ui/favorites-toggle";
import { useFavoritesStore } from "@/shared/store/favorites-store";
import { toast } from "sonner";
import { PaginationControls } from "@/features/pagination/ui/pagination-controls";
import { usePagination } from "@/features/pagination/model/use-pagination";
import { PaginationInfo } from "@/features/pagination/ui/pagination-info";

export function PostsList() {
  const [showFavorites, setShowFavorites] = useState(false);
  const { favorites } = useFavoritesStore();

  const {
    data: postsData,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ["posts-with-images"],
    queryFn: () => postsApi.getPostsWithImages(),
    retry: 2,
    retryDelay: 1000,
    onError: () => {
      toast.error("Ошибка загрузки постов");
    },
  });

  const pagination = usePagination({
    totalItems: postsData?.totalCount || 0,
    itemsPerPage: 12,
  });

  const { data: paginatedPostsData, isLoading: isPaginatedLoading } = useQuery({
    queryKey: ["paginated-posts", pagination.currentPage],
    queryFn: () =>
      postsApi.getPostsWithImages({
        page: pagination.currentPage,
        limit: pagination.itemsPerPage,
      }),
    enabled: !showFavorites && !!postsData,
    keepPreviousData: true,
  });

  // Объединяем данные для отображения
  const displayData = showFavorites ? postsData : paginatedPostsData;
  const displayPosts = displayData?.posts || [];
  const displayIsLoading = isLoading || (isPaginatedLoading && !showFavorites);

  // Фильтрация избранных постов
  const filteredPosts = useMemo(() => {
    if (showFavorites) {
      return displayPosts.filter((post) => favorites.includes(post.id));
    }
    return displayPosts;
  }, [displayPosts, favorites, showFavorites]);

  if (isError) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Alert variant="destructive" className="w-auto max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Ошибка загрузки</AlertTitle>
          <AlertDescription>
            {error instanceof Error
              ? error.message
              : "Не удалось загрузить посты. Проверьте интернет-соединение."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <FavoritesToggle
        showFavorites={showFavorites}
        onToggle={setShowFavorites}
      />

      {displayIsLoading ? (
        <Grid>
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className="flex flex-col space-y-3">
              <Skeleton className="h-48 w-full rounded-lg" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </Grid>
      ) : (
        <>
          <Grid>
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </Grid>

          {!showFavorites && postsData && (
            <div className="flex flex-col items-center space-y-4 pt-6 border-t">
              <PaginationInfo meta={pagination.paginationMeta} />
              <PaginationControls
                currentPage={pagination.currentPage}
                totalPages={pagination.paginationMeta.totalPages}
                onPageChange={pagination.goToPage}
              />
            </div>
          )}
        </>
      )}

      {!displayIsLoading && filteredPosts.length === 0 && (
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold">
              {showFavorites ? "Нет избранных постов" : "Посты не найдены"}
            </h2>
            <p className="text-muted-foreground">
              {showFavorites
                ? "Добавьте посты в избранное, чтобы увидеть их здесь."
                : "В данный момент нет постов для отображения."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
