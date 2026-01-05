import { useState } from "react"
import { DataTable } from "@/components/DataTable"
import { Pagination } from "@/components/Pagination"
import { getUserColumns } from "./data/columns"
import { useUserEnable, useUserList } from "./queries/useUserQueries"

export function Users() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const { data } = useUserList({ page, pageSize })
  const { mutate: enableUser } = useUserEnable()

  const columns = getUserColumns({ enableUser })

  return (
    <div className="container mx-auto py-10 flex flex-col gap-4">
      <DataTable
        columns={columns}
        data={data?.items || []}
      />
      <Pagination
        meta={data?.meta}
        onPage={setPage}
        onPageSize={setPageSize}
      />
    </div>
  )
}
