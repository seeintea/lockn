import { Link, useLocation } from "@tanstack/react-router"

import { Separator } from "@/components/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { useUser } from "@/stores"

type NavItem = {
  to: "/" | "/login"
  label: string
}

const navItems: NavItem[] = [{ to: "/", label: "首页" }]

export function AppSidebar() {
  const { pathname } = useLocation()
  const username = useUser((s) => s.username)
  const roleName = useUser((s) => s.roleName)

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                F
              </div>
              <div className="flex-1 text-left text-sm leading-tight">Finances</div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarSeparator className={"m-0 mt-2"} />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.to}>
              <SidebarMenuButton
                tooltip={item.label}
                isActive={pathname === item.to}
                render={<Link to={item.to} />}
              >
                <span>{item.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <Separator className="bg-sidebar-border" />
        <div className="px-1 text-sm leading-snug">
          <div className="font-medium">{username || "-"}</div>
          <div className="text-muted-foreground">{roleName || "-"}</div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
