import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getQueryClient } from '@/shared/api/client';
import { PostsList } from '@/widgets/posts-list/ui/posts-list';
import { postsApi } from '@/features/posts/api/posts-api';

export default async function PostsPage() {
  const queryClient = getQueryClient();
  
  // Prefetch общие данные о постах
  await queryClient.prefetchQuery({
    queryKey: ['posts-with-images'],
    queryFn: () => postsApi.getPostsWithImages(),
  });

  // Prefetch первую страницу
  await queryClient.prefetchQuery({
    queryKey: ['paginated-posts', 1],
    queryFn: () => postsApi.getPostsWithImages({
      page: 1,
      limit: 12,
    }),
  });

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Блог постов</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Откройте наши последние статьи и материалы
        </p>
      </div>
      
      <HydrationBoundary state={dehydrate(queryClient)}>
        <PostsList />
      </HydrationBoundary>
    </div>
  );
}