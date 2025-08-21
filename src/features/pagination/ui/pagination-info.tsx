'use client';

import { PaginationMeta } from '../model/types';

interface PaginationInfoProps {
  meta: PaginationMeta;
  className?: string;
}

export function PaginationInfo({ meta, className }: PaginationInfoProps) {
  const { currentPage, itemsPerPage, totalItems } = meta;
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className={className}>
      <p className="text-sm text-muted-foreground">
        Показано {startItem}-{endItem} из {totalItems} постов
      </p>
    </div>
  );
}