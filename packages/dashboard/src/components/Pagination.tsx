import {
  PaginationContent,
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
  onPage: (page: number) => void
  onPageSize: (pageSize: number) => void
}
const pageSizeSplit = ["1", "5", "10", "20", "50"]

export function Pagination({ meta, onPage, onPageSize }: PaginationProps) {
  const handlePageSize = (nextPageSize: string) => {
    onPage(1)
    onPageSize(Number(nextPageSize))
  }

  const handlePageFast = (next: boolean) => {
    let currentPage = meta?.currentPage || 1
    if (next) {
      currentPage = meta?.hasNextPage ? currentPage + 1 : currentPage
    } else {
      currentPage = meta?.hasPreviousPage ? currentPage - 1 : currentPage
    }
    onPage(currentPage)
  }

  return (
    <div className={"flex items-center gap-4 justify-end"}>
      <ShadcnPagination className={"m-0 w-fit"}>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              aria-disabled={!meta?.hasPreviousPage}
              href="#"
              onClick={() => handlePageFast(false)}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">{meta?.currentPage}</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              aria-disabled={!meta?.hasNextPage}
              href="#"
              onClick={() => handlePageFast(true)}
            />
          </PaginationItem>
        </PaginationContent>
      </ShadcnPagination>
      <Select onValueChange={handlePageSize}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder={`${meta?.pageSize}条/页`} />
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
