import type { User, UserInsert } from "@database/mysql"
import { z } from "zod"

const shape = {
  username: z.string().min(6).max(30).describe("用户名"),
  password: z.string().max(32).describe("密码"),
  deptId: z.number(),
  email: z.email().nullish(),
  phone: z.string().nullish(),
} satisfies z.ZodRawShape

export const CreateUserSchema = z.object(shape)

export const UpdateUserSchema = z.object({
  userId: z.string(),
  username: shape.username.nullish(),
  deptId: shape.deptId.nullish(),
  email: shape.email.nullish(),
  phone: shape.phone.nullish(),
  isDisabled: z.union([z.literal(0), z.literal(1)]).nullish(),
  isDeleted: z.union([z.literal(0), z.literal(1)]).nullable(),
})

export const UpdatePasswordSchema = z
  .object({
    userId: z.string().describe("用户ID"),
    oldPassword: shape.password.describe("旧密码"),
    newPassword: shape.password.describe("新密码"),
  })
  .meta({ id: "更新密码" })

export type CreateUserDto = z.infer<typeof CreateUserSchema>
export type UpdateUserDto = z.infer<typeof UpdateUserSchema>
export type UpdatePasswordDto = z.infer<typeof UpdatePasswordSchema>

export type { User, UserInsert }
export type UserUpdate = Omit<User, "createTime" | "updateTime">
