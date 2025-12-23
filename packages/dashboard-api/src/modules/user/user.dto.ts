import { createZodDto } from "nestjs-zod"
import { z } from "zod"

const shape = {
  userId: z.string().length(32).describe("用户ID"),
  username: z.string().min(6).max(30).describe("用户名"),
  password: z.string().min(6).max(100).describe("密码"),
  salt: z.string().length(16).describe("盐"),
  deptId: z.number().describe("部门ID"),
  email: z.email().describe("邮箱"),
  phone: z.string().describe("手机号"),
  isDisabled: z.number().min(0).max(1).describe("是否禁用"),
  isDeleted: z.number().min(0).max(1).describe("是否删除"),
  createTime: z.iso.datetime().describe("创建时间"),
  updateTime: z.iso.datetime().describe("更新时间"),
} satisfies z.ZodRawShape

const userResponseSchema = z
  .object({
    userId: shape.userId,
    username: shape.username,
    deptId: shape.deptId,
    email: shape.email,
    phone: shape.phone,
    isDisabled: shape.isDisabled,
    isDeleted: shape.isDeleted,
  })
  .meta({ id: "用户响应类型" })

const userWithPwdResponseSchema = userResponseSchema
  .extend({
    password: shape.password,
    salt: shape.salt,
  })
  .meta({ id: "用户响应类型（包含密码）" })

const updateUserServiceSchema = z
  .object({
    userId: shape.userId,
    username: shape.username,
    password: shape.password,
    salt: shape.salt,
    deptId: shape.deptId,
    email: shape.email.optional(),
    phone: shape.phone.optional(),
    isDisabled: shape.isDisabled,
    isDeleted: shape.isDeleted,
  })
  .meta({ id: "更新用户(service层)" })

export class UserResponseDto extends createZodDto(userResponseSchema) {}
export class UserWithPwdResponseDto extends createZodDto(userWithPwdResponseSchema) {}

export type User = z.infer<typeof userResponseSchema>
export type UserWithPwd = z.infer<typeof userWithPwdResponseSchema>
export type UpdateUser = z.infer<typeof updateUserServiceSchema>

const createUserSchema = z
  .object({
    username: shape.username,
    password: shape.password,
    deptId: shape.deptId,
    email: shape.email.optional(),
    phone: shape.phone.optional(),
  })
  .meta({ id: "新增用户" })

const updateUserSchema = z
  .object({
    userId: shape.userId,
    username: shape.username.optional(),
    deptId: shape.deptId.optional(),
    email: shape.email.optional(),
    phone: shape.phone.optional(),
  })
  .meta({ id: "更新用户信息" })

const updateUserPwdSchema = z
  .object({
    userId: shape.userId,
    oldPassword: shape.password.describe("旧密码"),
    newPassword: shape.password.describe("新密码"),
  })
  .meta({ id: "更新密码" })

const resetUserPwdSchema = z
  .object({
    userId: shape.userId,
    newPassword: shape.password.describe("新密码"),
  })
  .meta({ id: "重置密码" })

export class CreateUserDto extends createZodDto(createUserSchema) {}
export class UpdateUserDto extends createZodDto(updateUserSchema) {}
export class UpdateUserPwdDto extends createZodDto(updateUserPwdSchema) {}
export class ResetUserPwdDto extends createZodDto(resetUserPwdSchema) {}
