import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import type { UserModel } from "@/types"

const getUserColumns = ({ enableUser }: { enableUser: (userId: string) => void }) => {
  return [
    {
      accessorKey: "userId",
      header: "用户ID",
      cell: ({ row }) => {
        return <Badge>{row.getValue("userId") || "-"}</Badge>
      },
    },
    {
      accessorKey: "username",
      header: "用户名称",
    },
    {
      accessorKey: "email",
      header: "邮箱",
      cell: ({ row }) => {
        return row.getValue("email") || "/"
      },
    },
    {
      accessorKey: "phone",
      header: "手机号码",
      cell: ({ row }) => {
        return row.getValue("phone") || "/"
      },
    },
    {
      accessorKey: "isDisabled",
      header: "是否禁用",
      cell: ({ row }) => {
        // row.getValue("isDisabled") === 1 ? "是" : "否"
        return (
          <Switch
            checked={row.getValue("isDisabled") === 1}
            onCheckedChange={() => enableUser(row.getValue("userId") || "")}
          ></Switch>
        )
      },
    },
  ] as ColumnDef<UserModel>[]
}

export { getUserColumns }
