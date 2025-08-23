'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationControlsProps) {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1);
      rangeWithDots.push('...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...');
      rangeWithDots.push(totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className={cn('flex items-center justify-center space-x-2', className)}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="h-8 w-8 p-0 cursor-pointer disabled:cursor-not-allowed"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {visiblePages.map((page, index) =>
        page === '...' ? (
          <Button
            key={index}
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 cursor-default"
            disabled
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            key={index}
            variant={currentPage === page ? "default" : "outline"}
            size="sm"
            className="h-8 w-8 p-0 cursor-pointer disabled:cursor-not-allowed"
            onClick={() => onPageChange(page as number)}
          >
            {page}
          </Button>
        )
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="h-8 w-8 p-0 cursor-pointer disabled:cursor-not-allowed"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}