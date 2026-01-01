interface PaginationParams {
  page?: number | string
  pageSize?: number | string
}

interface SQLPaginationParams {
  limit: number
  offset: number
  page: number
  pageSize: number
}

export function getPaginationOptions(params: PaginationParams, defaultPageSize = 10): SQLPaginationParams {
  const page = Math.max(1, Number(params.page) || 1)
  const pageSize = Math.max(1, Number(params.pageSize) || defaultPageSize)

  const limit = pageSize
  const offset = (page - 1) * pageSize

  return { limit, offset, page, pageSize }
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

export interface PaginatedData<T> {
  items: T[]
  meta: PaginationMeta
}

export function createPaginatedData<T>(
  items: T[],
  totalItems: number,
  page: number,
  pageSize: number,
): PaginatedData<T> {
  const totalPages = Math.ceil(totalItems / pageSize)

  return {
    items,
    meta: {
      currentCount: items.length,
      total: totalItems,
      pageSize,
      totalPages,
      currentPage: page,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  }
}
