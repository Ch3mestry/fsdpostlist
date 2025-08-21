import { QueryClient } from '@tanstack/react-query';

// Создаем функцию для получения queryClient
// Это нужно для избежания shared state между запросами
export function getQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        cacheTime: 5 * 60 * 1000,
      },
    },
  });
}

// Экспортируем готовый клиент для клиентской части (если нужно)
export const queryClient = getQueryClient();