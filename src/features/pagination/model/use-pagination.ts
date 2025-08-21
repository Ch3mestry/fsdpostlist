import { useState, useMemo } from 'react';
import { PaginationMeta } from './types';

interface UsePaginationProps {
  totalItems: number;
  initialPage?: number;
  itemsPerPage?: number;
}

export function usePagination({
  totalItems,
  initialPage = 1,
  itemsPerPage = 12,
}: UsePaginationProps) {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const paginationMeta: PaginationMeta = useMemo(() => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    return {
      currentPage,
      itemsPerPage,
      totalItems,
      totalPages,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1,
    };
  }, [currentPage, itemsPerPage, totalItems]);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= paginationMeta.totalPages) {
      setCurrentPage(page);
    }
  };

  const nextPage = () => {
    if (paginationMeta.hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const prevPage = () => {
    if (paginationMeta.hasPrevPage) {
      setCurrentPage(prev => prev - 1);
    }
  };

  return {
    currentPage,
    itemsPerPage,
    paginationMeta,
    goToPage,
    nextPage,
    prevPage,
    setCurrentPage,
  };
}