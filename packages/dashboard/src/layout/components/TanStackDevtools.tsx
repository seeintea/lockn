import { TanStackDevtools as ReactDevtools } from "@tanstack/react-devtools"
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools"
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools"

export default function TanStackDevtools() {
  return (
    <ReactDevtools
      config={{ position: "bottom-right", defaultOpen: false }}
      plugins={[
        { name: "TanStack Router Devtool", render: <TanStackRouterDevtoolsPanel />, defaultOpen: true },
        { name: "TanStack Query Devtool", render: <ReactQueryDevtoolsPanel />, defaultOpen: true },
      ]}
    />
  )
}
