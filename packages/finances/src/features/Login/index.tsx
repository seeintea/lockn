import { useLogin } from "@/api"

export function Login() {
  const loginMutation = useLogin()

  return (
    <div className={"w-screen h-screen overflow-hidden flex items-center justify-center"}>
      <button
        type="button"
        disabled={loginMutation.isPending}
        onClick={() => loginMutation.mutate({ username: "admin", password: "admin" })}
      >
        Login
      </button>
    </div>
  )
}
