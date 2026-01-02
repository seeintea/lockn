import { ShieldHalf, Users } from "lucide-react"

export interface RegisterMenu {
  title: string
  permission: string
  path: string
  icon?: React.ReactNode
  children?: RegisterMenu[]
}

export const registerMenus: RegisterMenu[] = [
  {
    title: "用户列表",
    permission: "user:list",
    path: "/users",
    icon: <Users />,
  },
  {
    title: "角色列表[test]",
    permission: "role:menu",
    path: "/roles",
    icon: <ShieldHalf />,
    children: [
      {
        title: "角色管理",
        permission: "role:list",
        path: "/roles/manage",
      },
    ],
  },
]
