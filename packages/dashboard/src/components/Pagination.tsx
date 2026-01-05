import { useEffect, useState } from "react"
import {
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Pagination as ShadcnPagination,
} from "@/components/ui/pagination"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { PaginationMeta } from "@/types"

interface PaginationProps {
  meta?: PaginationMeta
  maxPageItem?: number
  onPage: (page: number) => void
  onPageSize: (pageSize: number) => void
}
const pageSizeSplit = ["5", "10", "20", "50"]

export function Pagination({ meta, onPage, onPageSize, maxPageItem = 2 }: PaginationProps) {
  const [pageItem, setPageItem] = useState<number[]>([])

  const handlePageSize = (nextPageSize: string) => {
    onPage(1)
    onPageSize(Number(nextPageSize))
  }

  const handlePreviousPage = () => {
    let currentPage = meta?.currentPage || 1
    currentPage = meta?.hasPreviousPage ? currentPage - 1 : currentPage
    onPage(currentPage)
  }

  const handleNextPage = () => {
    let currentPage = meta?.currentPage || 1
    currentPage = meta?.hasNextPage ? currentPage + 1 : currentPage
    onPage(currentPage)
  }

  useEffect(() => {
    if (!meta) {
      setPageItem([])
      return
    }

    const middle = Math.floor(maxPageItem / 2)
    const start = Math.max(1, meta?.currentPage - middle)
    const end = Math.min(meta?.totalPages || 1, meta?.currentPage + middle)
    const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i)
    if (start !== 1) {
      pages.unshift(-1)
    }
    if (end !== meta?.totalPages) {
      pages.push(-2)
    }
    setPageItem(pages)
  }, [meta, maxPageItem])

  if (!meta || meta?.totalPages === 0) {
    return null
  }

  return (
    <div className={"flex items-center gap-4 justify-end"}>
      <ShadcnPagination className={"m-0 w-fit"}>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              aria-disabled={!meta?.hasPreviousPage}
              onClick={handlePreviousPage}
            />
          </PaginationItem>
          {pageItem.map((page) => {
            if (page < 0) {
              return (
                <PaginationItem key={page}>
                  <PaginationEllipsis />
                </PaginationItem>
              )
            }
            return (
              <PaginationItem key={page}>
                <PaginationLink
                  isActive={meta?.currentPage === page}
                  onClick={() => onPage(page)}
                  className={"mx-0.5"}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            )
          })}
          <PaginationItem>
            <PaginationNext
              aria-disabled={!meta?.hasNextPage}
              onClick={handleNextPage}
            />
          </PaginationItem>
        </PaginationContent>
      </ShadcnPagination>
      <Select onValueChange={handlePageSize}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder={`${meta?.pageSize || 10}条/页`} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {pageSizeSplit.map((size) => (
              <SelectItem
                key={size}
                value={size}
              >
                {size}条/页
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
