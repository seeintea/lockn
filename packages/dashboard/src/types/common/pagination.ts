export interface PaginationData<T> {
  items: T[]
  meta: PaginationMeta
}

export interface PaginationMeta {
  currentCount: number
  total: number
  pageSize: number
  totalPages: number
  currentPage: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}
