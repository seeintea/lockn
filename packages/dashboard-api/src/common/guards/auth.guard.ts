import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { JwtService } from "@nestjs/jwt"
import { Request } from "express"
import { PERMISSION_DECORATOR, PUBLIC_DECORATOR } from "@/constants"
import { RedisService } from "@/database"

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private redisService: RedisService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const targets = [context.getHandler(), context.getClass()]
    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_DECORATOR, targets)
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
        secret: process.env.JWT_SECRET,
      })
      const userRedisKey = `auth:token:${token}`
      const cachedUserInfo = await this.redisService.get(userRedisKey)
      if (!cachedUserInfo) {
        throw new UnauthorizedException("Token invalid or expired")
      }
      request.user = JSON.parse(cachedUserInfo)
      const needPermission = this.reflector.getAllAndOverride<string>(PERMISSION_DECORATOR, targets)
      if (needPermission) {
        // TODO
        const userPermissions = request.user.permissions as string[]
        if (!userPermissions.includes(needPermission)) {
          throw new UnauthorizedException("Permission denied")
        }
      }
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
