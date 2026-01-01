import { createZodDto } from "nestjs-zod"
import { z } from "zod"
import { paginationDataSchema, paginationQuerySchema } from "@/types"

const shape = {
  userId: z.string().length(32).describe("用户ID"),
  username: z.string().min(6).max(30).describe("用户名"),
  password: z.string().min(6).max(100).describe("密码"),
  salt: z.string().length(16).describe("盐"),
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
    email: shape.email.optional(),
    phone: shape.phone.optional(),
    isDisabled: shape.isDisabled,
    isDeleted: shape.isDeleted,
  })
  .meta({ id: "更新用户(service层)" })

const paginationUserResponseSchema = paginationDataSchema(userResponseSchema)

export class UserResponseDto extends createZodDto(userResponseSchema) {}
export class UserWithPwdResponseDto extends createZodDto(userWithPwdResponseSchema) {}
export class PaginationUserResponseDto extends createZodDto(paginationUserResponseSchema) {}

export type User = z.infer<typeof userResponseSchema>
export type UserWithPwd = z.infer<typeof userWithPwdResponseSchema>
export type UpdateUser = z.infer<typeof updateUserServiceSchema>
export type UserPagination = z.infer<typeof paginationUserResponseSchema>

const createUserSchema = z
  .object({
    username: shape.username,
    password: shape.password,
    email: shape.email.optional(),
    phone: shape.phone.optional(),
  })
  .meta({ id: "新增用户" })

const updateUserSchema = z
  .object({
    userId: shape.userId,
    username: shape.username.optional(),
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

const paginationUserQuerySchema = paginationQuerySchema
  .extend({
    userId: shape.userId.optional(),
    username: shape.username.optional(),
  })
  .meta({ id: "分页查询用户" })

export type PaginationUserQuery = z.infer<typeof paginationUserQuerySchema>
export class CreateUserDto extends createZodDto(createUserSchema) {}
export class UpdateUserDto extends createZodDto(updateUserSchema) {}
export class UpdateUserPwdDto extends createZodDto(updateUserPwdSchema) {}
export class ResetUserPwdDto extends createZodDto(resetUserPwdSchema) {}
export class PaginationUserQueryDto extends createZodDto(paginationUserQuerySchema) {}
