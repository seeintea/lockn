import type { User, UserInsert } from "@database/mysql"
import { z } from "zod"

const shape = {
  username: z.string().min(6).max(30),
  password: z.string().max(32),
  deptId: z.number(),
  email: z.email().nullish(),
  phone: z.string().nullish(),
} satisfies z.ZodRawShape

export const CreateUserSchema = z.object(shape)

export const UpdateUserSchema = z.object({
  userId: z.bigint(),
  username: shape.username.nullish(),
  password: shape.password.nullish(),
  deptId: shape.deptId.nullish(),
  email: shape.email.nullish(),
  phone: shape.phone.nullish(),
  isDisabled: z.union([z.literal(0), z.literal(1)]).nullish(),
  isDeleted: z.union([z.literal(0), z.literal(1)]).nullable(),
})

export type CreateUserDto = z.infer<typeof CreateUserSchema>
export type UpdateUserDto = z.infer<typeof UpdateUserSchema>

export type { User, UserInsert }
