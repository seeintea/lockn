import { createZodDto } from "nestjs-zod"
import { z } from "zod"

const loginSchema = z
  .object({
    username: z.string().min(1).max(30).describe("用户名"),
    password: z.string().min(1).max(100).describe("密码"),
  })
  .meta({ id: "登录请求" })

const loginResponseSchema = z
  .object({
    userId: z.string().length(32).describe("用户ID"),
    username: z.string().min(1).max(30).describe("用户名"),
    accessToken: z.string().min(1).describe("访问令牌"),
  })
  .meta({ id: "登录响应" })

export class LoginDto extends createZodDto(loginSchema) {}
export class LoginResponseDto extends createZodDto(loginResponseSchema) {}

export type Login = z.infer<typeof loginSchema>
export type LoginResponse = z.infer<typeof loginResponseSchema>
