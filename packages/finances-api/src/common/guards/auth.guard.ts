import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { JwtService } from "@nestjs/jwt"
import type { Request } from "express"
import { PUBLIC_DECORATOR } from "@/constants/auth.constants"
import { RedisService } from "@/database/redis/redis.service"

type JwtPayload = { userId?: string; exp?: number; iat?: number }

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    private readonly redisService: RedisService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const targets = [context.getHandler(), context.getClass()]
    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_DECORATOR, targets)
    if (isPublic) return true

    const request = context.switchToHttp().getRequest<Request>()
    if (this.isSwaggerRequest(request)) return true

    const token = this.extractBearerToken(request)
    if (!token) throw new UnauthorizedException()

    const payload = (await this.jwtService.verifyAsync(token, { secret: process.env.JWT_SECRET })) as JwtPayload
    if (!payload?.userId) throw new UnauthorizedException()

    const cached = await this.redisService.get(`auth:token:${token}`)
    if (!cached) throw new UnauthorizedException("Token invalid or expired")
    ;(request as unknown as { user?: unknown }).user = JSON.parse(cached)
    return true
  }

  private isSwaggerRequest(request: Request): boolean {
    const url = request.originalUrl || request.url || ""
    return url.startsWith("/swagger") || url.startsWith("/swagger/")
  }

  private extractBearerToken(request: Request): string | undefined {
    const authorization = request.headers.authorization
    if (!authorization) return undefined
    const [type, token] = authorization.split(" ")
    if (type !== "Bearer") return undefined
    return token
  }
}
