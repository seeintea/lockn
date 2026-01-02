import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { AppBreadcrumb } from "./AppBreadcrumb"

export function AppHeader() {
  return (
    <header className="shadow-2xs p-4 flex items-center gap-4 sticky top-0">
      <SidebarTrigger className={"size-7"} />
      <Separator
        orientation="vertical"
        className={"h-6!"}
      />
      <div className={"flex-1"}>
        <AppBreadcrumb />
      </div>
      <div className={"h-full flex items-center gap-4"}>
        <AnimatedThemeToggler />
      </div>
    </header>
  )
}
