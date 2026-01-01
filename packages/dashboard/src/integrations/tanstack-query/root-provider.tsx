import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { toast } from "sonner"

export function getContext() {
  const queryClient = new QueryClient({
    defaultOptions: {
      mutations: {
        onError: (error) => {
          console.error("Mutation failed:", error)
          toast.error("操作失败，请检查网络后重试")
        },
      },
    },
  })
  return {
    queryClient,
  }
}

export function Provider({ children, queryClient }: { children: React.ReactNode; queryClient: QueryClient }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
