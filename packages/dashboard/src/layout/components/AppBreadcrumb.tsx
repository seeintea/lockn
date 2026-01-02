import { useLocation } from "@tanstack/react-router"
import { Fragment, useMemo } from "react"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { registerMenus } from "./data/register-menus"

export function AppBreadcrumb() {
  const { pathname } = useLocation()

  const breadcrumbItems = useMemo(() => {
    const menus = registerMenus.filter((menu) => pathname.includes(menu.path))
    if (!menus.length) return []
    const items = menus.map((menu) => menu.title)
    if (menus[0].children) {
      items.push(...menus[0].children.filter((child) => pathname.includes(child.path)).map((child) => child.title))
    }
    return items
  }, [pathname])

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>Dashboard</BreadcrumbItem>
        {breadcrumbItems.map((item) => (
          <Fragment key={item}>
            <BreadcrumbSeparator />
            <BreadcrumbItem>{item}</BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
