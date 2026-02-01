import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"

import { useCreateUser } from "@/api"
import { PasswordInput } from "@/components/PasswordInput"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type FormValues = {
  username: string
  password: string
  email: string
  phone: string
  isDisabled: "0" | "1"
}

function generateSalt() {
  const cryptoObj = window.crypto
  const bytes = new Uint8Array(16)
  cryptoObj.getRandomValues(bytes)
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

export function CreateUserDialog({ onCreated }: { onCreated?: () => void }) {
  const [open, setOpen] = useState(false)
  const createUserMutation = useCreateUser()

  const defaultValues = useMemo<FormValues>(
    () => ({
      username: "",
      password: "",
      email: "",
      phone: "",
      isDisabled: "0",
    }),
    []
  )

  const form = useForm<FormValues>({
    defaultValues,
  })

  useEffect(() => {
    if (!open) {
      form.reset(defaultValues)
    }
  }, [defaultValues, form, open])

  const onSubmit = form.handleSubmit((values) => {
    createUserMutation.mutate(
      {
        username: values.username.trim(),
        password: values.password,
        salt: generateSalt(),
        email: values.email.trim() ? values.email.trim() : undefined,
        phone: values.phone.trim() ? values.phone.trim() : undefined,
        isDisabled: values.isDisabled === "1",
      },
      {
        onSuccess: () => {
          setOpen(false)
          onCreated?.()
        },
      }
    )
  })

  const isPending = createUserMutation.isPending

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (isPending) return
        setOpen(next)
      }}
    >
      <DialogTrigger render={<Button size="sm">新增用户</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>新增用户</DialogTitle>
        </DialogHeader>

        <form
          className="flex flex-col gap-4"
          onSubmit={onSubmit}
        >
          <FieldGroup>
            <Field>
              <FieldLabel>用户名</FieldLabel>
              <FieldContent>
                <Input
                  {...form.register("username", { required: "请输入用户名" })}
                  placeholder="请输入用户名"
                  disabled={isPending}
                />
                <FieldError errors={[form.formState.errors.username]} />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>密码</FieldLabel>
              <FieldContent>
                <PasswordInput
                  {...form.register("password", { required: "请输入密码", minLength: { value: 6, message: "密码至少 6 位" } })}
                  placeholder="请输入密码"
                  disabled={isPending}
                />
                <FieldError errors={[form.formState.errors.password]} />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>邮箱</FieldLabel>
              <FieldContent>
                <Input
                  {...form.register("email")}
                  placeholder="可选"
                  disabled={isPending}
                />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>手机</FieldLabel>
              <FieldContent>
                <Input
                  {...form.register("phone")}
                  placeholder="可选"
                  disabled={isPending}
                />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>状态</FieldLabel>
              <FieldContent>
                <Select
                  value={form.watch("isDisabled")}
                  onValueChange={(value) => form.setValue("isDisabled", value as FormValues["isDisabled"])}
                  disabled={isPending}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="请选择" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">正常</SelectItem>
                    <SelectItem value="1">禁用</SelectItem>
                  </SelectContent>
                </Select>
              </FieldContent>
            </Field>
          </FieldGroup>

          <DialogFooter>
            <Button
              type="submit"
              disabled={isPending}
            >
              创建
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
