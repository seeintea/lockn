import type { PropsWithChildren } from "react"
import { Toaster } from "@/components/ui/sonner"

const TanStackDevtools =
  process.env.NODE_ENV === "development" ? (await import("./TanStackDevtools")).default : () => null

interface AppContainerProps extends PropsWithChildren {
  className?: string
}

export function AppContainer(props: AppContainerProps) {
  const { className = "", children } = props

  return (
    <main className={className}>
      {children}
      <Toaster position="top-center" />
      <TanStackDevtools />
    </main>
  )
}
