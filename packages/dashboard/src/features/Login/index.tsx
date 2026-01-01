import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "@tanstack/react-router"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { TextAnimate } from "@/components/ui/text-animate"
import { useLogin } from "@/hooks/queries"

const loginSchema = z.object({
  username: z.string().nonempty({ message: "请输入用户名" }),
  password: z.string().nonempty({ message: "请输入密码" }).min(6, { message: "密码长度至少为6个字符" }),
})

export function Login() {
  const { mutateAsync } = useLogin()
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  const [showPassword, setShowPassword] = useState<boolean>(false)

  const toggleShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const onSubmit = async (form: z.infer<typeof loginSchema>) => {
    const resp = await mutateAsync(form)
    if (resp.code === 200) {
      toast.success("登录成功！")
      navigate({
        to: "/users",
      })
    } else {
      toast.error(resp.message)
    }
  }

  return (
    <div
      className={
        "absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF,transparent)] dark:bg-[radial-gradient(circle_500px_at_50%_200px,#3e3e3e,transparent)]"
      }
    >
      <AnimatedThemeToggler className={"absolute right-8 top-4"} />
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
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-6">
                  <FormField
                    name="username"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>用户名</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="请输入用户名"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage>{form.formState.errors.username?.message}</FormMessage>
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="password"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>密码</FormLabel>
                        <div className={"relative"}>
                          <FormControl>
                            <Input
                              className={"pr-10"}
                              type={showPassword ? "text" : "password"}
                              placeholder="请输入密码"
                              {...field}
                            />
                          </FormControl>
                          <Button
                            type="button"
                            className={"absolute top-1/2 right-0 -translate-y-1/2"}
                            onClick={toggleShowPassword}
                            variant={"link"}
                          >
                            {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                          </Button>
                        </div>
                        <FormMessage>{form.formState.errors.password?.message}</FormMessage>
                      </FormItem>
                    )}
                  />
                  <Button type="submit">登录</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
