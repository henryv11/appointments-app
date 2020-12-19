export function usePagination({ currentOffset, limit, totalRows }: UsePaginationProps) {
  return {
    hasNextPage: currentOffset + limit < totalRows,
    hasPreviousPage: currentOffset - limit >= 0,
    nextOffset: Math.min(totalRows, currentOffset + limit),
    previousOffset: Math.max(0, currentOffset - limit),
    totalPages: Math.ceil(totalRows / limit),
    currentPage: currentOffset / limit + 1,
    pageOffset: (page: number) => Math.min(limit * (page - 1), totalRows),
  } as const;
}

interface UsePaginationProps {
  currentOffset: number;
  limit: number;
  totalRows: number;
}
