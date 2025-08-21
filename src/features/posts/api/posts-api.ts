import { Post, PostWithImage } from "@/entities/post/model/types";
import { PaginationParams } from "@/features/pagination/model/types";

const BASE_URL = "https://jsonplaceholder.typicode.com";

export const postsApi = {
  // Получение постов с пагинацией
  async getPosts(params?: PaginationParams): Promise<Post[]> {
    try {
      const url = params
        ? `${BASE_URL}/posts?_page=${params.page}&_limit=${params.limit}`
        : `${BASE_URL}/posts`;

      const response = await fetch(url, {
        next: { revalidate: 60 },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      throw new Error("Failed to fetch posts");
    }
  },

  // Получение общего количества постов
  async getTotalPostsCount(): Promise<number> {
    try {
      const response = await fetch(`${BASE_URL}/posts`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.length;
    } catch (error) {
      console.error("Failed to fetch total posts count:", error);
      return 100; // Fallback value
    }
  },

  // Получение постов с изображениями с пагинацией
  async getPostsWithImages(params?: PaginationParams): Promise<{
    posts: PostWithImage[];
    totalCount: number;
  }> {
    try {
      const [posts, totalCount] = await Promise.all([
        this.getPosts(params),
        this.getTotalPostsCount(),
      ]);

      const postsWithImages = posts.map((post) => ({
        ...post,
        imageUrl: `https://picsum.photos/600/400?random=${post.id}`,
      }));

      return {
        posts: postsWithImages,
        totalCount,
      };
    } catch (error) {
      console.error("Failed to fetch posts with images:", error);
      throw new Error("Failed to fetch posts with images");
    }
  },
};
