import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { JwtService } from "@nestjs/jwt"
import { Request } from "express"
import { IS_PUBLIC_KEY } from "@/common/decorators/public.decorator"
import { RedisService } from "@/database"

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private redisService: RedisService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (isPublic) {
      return true
    }

    const request = context.switchToHttp().getRequest()
    const token = this.extractTokenFromHeader(request)
    if (!token) {
      throw new UnauthorizedException()
    }

    try {
      await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET || "default_secret_key",
      })
      const redisKey = `auth:token:${token}`
      const cachedUserInfo = await this.redisService.get(redisKey)
      if (!cachedUserInfo) {
        throw new UnauthorizedException("Token invalid or expired")
      }
      request.user = JSON.parse(cachedUserInfo)
    } catch {
      throw new UnauthorizedException()
    }
    return true
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? []
    return type === "Bearer" ? token : undefined
  }
}
