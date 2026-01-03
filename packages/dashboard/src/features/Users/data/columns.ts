import type { ColumnDef } from "@tanstack/react-table"
import type { UserModel } from "@/types"

export const columns: ColumnDef<UserModel>[] = [
  {
    accessorKey: "userId",
    header: "用户ID",
  },
  {
    accessorKey: "username",
    header: "用户名称",
  },
  {
    accessorKey: "email",
    header: "邮箱",
    cell: ({ row }) => {
      return row.getValue("email") || "-"
    },
  },
  {
    accessorKey: "phone",
    header: "手机号码",
    cell: ({ row }) => {
      return row.getValue("phone") || "-"
    },
  },
  {
    accessorKey: "isDisabled",
    header: "是否禁用",
    cell: ({ row }) => {
      return row.getValue("isDisabled") === 1 ? "是" : "否"
    },
  },
]
