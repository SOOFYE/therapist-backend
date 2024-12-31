export interface PaginatedResult<T> {
    hasNext: boolean;
    page: number;
    total: number;
    data: T[];
  }
  