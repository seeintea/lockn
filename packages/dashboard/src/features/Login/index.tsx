import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TextAnimate } from "@/components/ui/text-animate"
import { LoginForm } from "./components/LoginForm"

export function Login() {
  return (
    <div
      className={
        "absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF,transparent)] dark:bg-[radial-gradient(circle_500px_at_50%_200px,#3e3e3e,transparent)]"
      }
    >
      <AnimatedThemeToggler className={"absolute right-4 top-4"} />
      <div className={"flex flex-col items-center justify-center h-[80vh] gap-4"}>
        <TextAnimate
          animation="blurInUp"
          by="character"
          once
          className={"text-4xl font-bold mb-8"}
        >
          Dashboard
        </TextAnimate>
        <Card className={"w-full max-w-sm"}>
          <CardHeader>
            <CardTitle>登录</CardTitle>
          </CardHeader>
          <CardContent>
            <LoginForm redirectTo="/" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
