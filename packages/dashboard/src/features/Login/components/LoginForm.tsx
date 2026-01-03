import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "@tanstack/react-router"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useLogin } from "../queries/useAuthQueries"
import { PasswordInput } from "./PasswordInput"

const loginSchema = z.object({
  username: z.string().nonempty({ message: "请输入用户名" }),
  password: z.string().nonempty({ message: "请输入密码" }).min(6, { message: "密码长度至少为6个字符" }),
})

interface LoginFormProps {
  redirectTo: string
}

export function LoginForm({ redirectTo }: LoginFormProps) {
  const { mutateAsync } = useLogin()
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  const onSubmit = async (form: z.infer<typeof loginSchema>) => {
    const resp = await mutateAsync(form)
    if (resp.code === 200) {
      toast.success("登录成功！")
      navigate({
        to: redirectTo,
      })
    } else {
      toast.error(resp.message)
    }
  }

  return (
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
                <PasswordInput
                  placeholder="请输入密码"
                  {...field}
                />
                <FormMessage>{form.formState.errors.password?.message}</FormMessage>
              </FormItem>
            )}
          />
          <Button type="submit">登录</Button>
        </div>
      </form>
    </Form>
  )
}
