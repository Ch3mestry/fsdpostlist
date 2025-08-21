import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Post } from '@/entities/post/model/types';

interface FavoritesState {
  favorites: number[]; // Array of post IDs
  addToFavorites: (postId: number) => void;
  removeFromFavorites: (postId: number) => void;
  isFavorite: (postId: number) => boolean;
  toggleFavorite: (postId: number) => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      
      addToFavorites: (postId) =>
        set((state) => ({
          favorites: [...state.favorites, postId],
        })),
      
      removeFromFavorites: (postId) =>
        set((state) => ({
          favorites: state.favorites.filter((id) => id !== postId),
        })),
      
      isFavorite: (postId) => get().favorites.includes(postId),
      
      toggleFavorite: (postId) => {
        const { isFavorite, addToFavorites, removeFromFavorites } = get();
        if (isFavorite(postId)) {
          removeFromFavorites(postId);
        } else {
          addToFavorites(postId);
        }
      },
    }),
    {
      name: 'favorites-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);