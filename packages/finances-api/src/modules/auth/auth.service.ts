import { Injectable, UnauthorizedException } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { JwtService } from "@nestjs/jwt"
import { BusinessException } from "@/common/exceptions/business.exception"
import { verifyPassword } from "@/common/utils/password"
import { RedisService } from "@/database/redis/redis.service"
import { UserService } from "@/modules/user/user.service"
import type { LoginResponse } from "./auth.dto"

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) {}

  async login(username: string, password: string): Promise<LoginResponse> {
    const user = await this.userService.findAuthUserByUsername(username)
    if (!user) throw new BusinessException("用户名或密码错误，请重试")
    if (user.isDisabled) throw new BusinessException("用户已被禁用")

    const ok = verifyPassword(password, user.password, user.salt)
    if (!ok) throw new BusinessException("用户名或密码错误，请重试")

    const accessToken = await this.jwtService.signAsync({ userId: user.userId })

    const ttl = Number(this.configService.getOrThrow<number>("TOKEN_EXPIRE_TIME"))
    const userKey = `auth:user:${user.userId}`
    const oldToken = await this.redisService.get(userKey)
    if (oldToken) {
      await this.redisService.del(`auth:token:${oldToken}`)
    }

    await this.redisService.set(`auth:token:${accessToken}`, JSON.stringify({ userId: user.userId, username }), ttl)
    await this.redisService.set(userKey, accessToken, ttl)

    return {
      userId: user.userId,
      username: user.username,
      accessToken,
    }
  }

  async logout(token?: string): Promise<boolean> {
    if (!token) return true

    await this.redisService.del(`auth:token:${token}`)

    try {
      const payload = (await this.jwtService.verifyAsync(token, { secret: process.env.JWT_SECRET })) as { userId?: string }
      const userId = payload?.userId
      if (userId) {
        await this.redisService.del(`auth:user:${userId}`)
      }
    } catch {
      throw new UnauthorizedException()
    }

    return true
  }
}
