import { Link, useLocation } from "@tanstack/react-router"
import { Bot, ChevronRight } from "lucide-react"
import { useMemo } from "react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { type RegisterMenu, registerMenus } from "./data/register-menus"

export function AppSideBar() {
  const { pathname } = useLocation()

  const realMenus = useMemo(() => {
    // TODO: filter permission
    return registerMenus
  }, [])

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenuItem>
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
              <Bot className="size-4" />
            </div>
            <div className="flex-1 text-left text-sm leading-tight">Dashboard</div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarHeader>
      <SidebarContent className={"p-2"}>
        <SidebarMenu>
          {realMenus.map((item) => (
            <AppSideBarMenuItem
              key={item.path}
              item={item}
              href={pathname}
            />
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}

interface AppSideBarMenuItemProps {
  item: RegisterMenu
  href: string
}

function AppSideBarMenuItem(props: AppSideBarMenuItemProps) {
  const { state } = useSidebar()
  const hasChildren = props.item.children && props.item.children.length > 0
  if (hasChildren) {
    return state === "collapsed" ? <SidebarMenuCollapsedDropdown {...props} /> : <SidebarMenuCollapsible {...props} />
  }
  return <SidebarMenuNavigation {...props} />
}

function SidebarMenuNavigation({ item, href }: AppSideBarMenuItemProps) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        tooltip={item.title}
        isActive={checkIsActive(href, item)}
      >
        <Link to={item.path}>
          {item.icon}
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

function SidebarMenuCollapsible({ item, href }: AppSideBarMenuItemProps) {
  return (
    <Collapsible
      className="group/collapsible"
      asChild
      defaultOpen={checkIsActive(href, item)}
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={item.title}>
            {item.icon}
            <span>{item.title}</span>
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.children?.map((subItem) => (
              <SidebarMenuSubItem key={subItem.path}>
                <SidebarMenuSubButton
                  asChild
                  isActive={checkIsActive(href, subItem)}
                >
                  <Link to={subItem.path}>
                    {subItem.icon}
                    <span>{subItem.title}</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  )
}

function SidebarMenuCollapsedDropdown({ item, href }: AppSideBarMenuItemProps) {
  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            tooltip={item.title}
            isActive={checkIsActive(href, item)}
          >
            {item.icon}
            <span>{item.title}</span>
            <ChevronRight className="ms-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="right"
          align="start"
          sideOffset={4}
        >
          <DropdownMenuLabel>{item.title}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {item.children?.map((subItem) => (
            <DropdownMenuItem
              key={subItem.path}
              asChild
            >
              <Link
                to={subItem.path}
                className={`${checkIsActive(href, subItem) ? "bg-secondary" : ""}`}
              >
                {subItem.icon}
                <span className="max-w-52 text-wrap">{subItem.title}</span>
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  )
}

function checkIsActive(href: string, item: RegisterMenu) {
  return href === item.path || item?.children?.some((i) => i.path === href)
}
