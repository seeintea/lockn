import { createZodDto } from "nestjs-zod"
import z from "zod"

const loginSchema = z
  .object({
    username: z.string().min(6).max(30).describe("用户名"),
    password: z.string().min(6).max(100).describe("密码"),
    validCode: z.string().length(6).describe("验证码"),
  })
  .meta({ id: "登录请求类型" })

export class LoginDto extends createZodDto(loginSchema) {}

const loginResponseSchema = z
  .object({
    userId: z.string().length(32).describe("用户ID"),
    username: z.string().min(6).max(30).describe("用户名"),
    accessToken: z.string().describe("JWT Token"),
  })
  .meta({ id: "登录响应类型" })

export class LoginResponseDto extends createZodDto(loginResponseSchema) {}
