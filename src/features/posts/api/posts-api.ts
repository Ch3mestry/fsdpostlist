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

  // Получение фотографии для конкретного поста
  async getPhotoForPost(postId: number): Promise<string> {
    try {
      // В JSONPlaceholder albumId соответствует postId
      const response = await fetch(
        `${BASE_URL}/photos?albumId=${postId}&_limit=1`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const photos = await response.json();
      
      // Если найдены фотографии, возвращаем URL первой
      if (photos.length > 0) {
        return photos[0].url;
      }
      
      // Fallback: если фото не найдено, используем случайное изображение
      return `https://picsum.photos/600/400?random=${postId}`;
    } catch (error) {
      console.error(`Failed to fetch photo for post ${postId}:`, error);
      return `https://picsum.photos/600/400?random=${postId}`;
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

      // Создаем массив промисов для получения фото для каждого поста
      const postsWithImagesPromises = posts.map(async (post) => {
        const imageUrl = await this.getPhotoForPost(post.id);
        return {
          ...post,
          imageUrl,
        };
      });

      const postsWithImages = await Promise.all(postsWithImagesPromises);

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