import { redirect } from "@tanstack/react-router"
import { useUser } from "@/stores/useUser"

class FetchInstance {
  private baseURL: string
  private timeout: number
  private retries: number
  private requestInterceptors: Array<(options: RequestInit) => RequestInit> = []
  private responseInterceptors: Array<(response: Response) => Response> = []

  constructor(config: { baseURL?: string; timeout?: number; retries?: number } = {}) {
    this.baseURL = config.baseURL || ""
    this.timeout = config.timeout || 10000
    this.retries = config.retries || 0
  }

  useRequestInterceptor(interceptor: (options: RequestInit) => RequestInit) {
    this.requestInterceptors.push(interceptor)
  }

  useResponseInterceptor(interceptor: (response: Response) => Response) {
    this.responseInterceptors.push(interceptor)
  }

  async request<T>(url: string, options: RequestInit = {}): Promise<T> {
    const fullURL = this.baseURL ? `${this.baseURL}${url}` : url
    let mergedOptions: RequestInit = { ...options }

    for (const interceptor of this.requestInterceptors) {
      mergedOptions = interceptor(mergedOptions)
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)
    mergedOptions.signal = controller.signal

    let lastError: Error = new Error("Request failed")

    for (let attempt = 0; attempt <= this.retries; attempt += 1) {
      try {
        let response: Response = await fetch(fullURL, mergedOptions)

        for (const interceptor of this.responseInterceptors) {
          response = interceptor(response)
        }

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        clearTimeout(timeoutId)
        return (await response.json()) as T
      } catch (error) {
        lastError = error as Error
        if (lastError?.name === "AbortError") {
          lastError = new Error(`Request timed out after ${this.timeout}ms`)
        }
        if (attempt < this.retries) {
          await new Promise((resolve) => setTimeout(resolve, 1000 * attempt))
        }
      }
    }

    throw lastError
  }

  get<T>(url: string, options?: RequestInit): Promise<T> {
    return this.request<T>(url, { ...options, method: "GET" })
  }

  post<T>(url: string, data?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(url, {
      ...options,
      method: "POST",
      headers: { "Content-Type": "application/json", ...options?.headers },
      body: JSON.stringify(data),
    })
  }
}

const api = new FetchInstance({
  baseURL: import.meta.env.PUBLIC_BASE_URL || "",
  timeout: 60000,
  retries: 0,
})

// biome-ignore lint/correctness/useHookAtTopLevel: <not react hook>
api.useRequestInterceptor((options) => {
  const token = useUser.getState().token
  if (token) {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    }
  }
  return options
})

// biome-ignore lint/correctness/useHookAtTopLevel: <not react hook>
api.useResponseInterceptor((response) => {
  if (response.status === 401) {
    redirect({
      to: "/login",
    })
  }
  return response
})

export { api }
