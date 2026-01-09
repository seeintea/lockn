import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common"
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
      const payload = await this.jwtService.verifyAsync(token, {
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
        const roleId = (payload as { roleId?: number }).roleId
        if (!roleId) {
          throw new ForbiddenException("Role missing")
        }
        const roleMenuKey = `auth:role-menu:${roleId}`
        const cachedRoleMenus = await this.redisService.get(roleMenuKey)
        if (!cachedRoleMenus) {
          throw new ForbiddenException("Role menus not cached")
        }
        const roleMenuTree = JSON.parse(cachedRoleMenus)
        const allowed = this.hasPermission(roleMenuTree, needPermission)
        if (!allowed) {
          throw new ForbiddenException("Permission denied")
        }
      }
    } catch (e) {
      if (e instanceof UnauthorizedException || e instanceof ForbiddenException) {
        throw e
      }
      throw new UnauthorizedException()
    }
    return true
  }

  private hasPermission(node: unknown, permission: string): boolean {
    if (!node || typeof node !== "object") return false
    const anyNode = node as Record<string, unknown>
    if (anyNode.perms === permission) return true
    const children = anyNode.children
    if (Array.isArray(children) && children.some((c) => this.hasPermission(c, permission))) return true
    const buttons = anyNode.buttons
    if (Array.isArray(buttons) && buttons.some((b) => this.hasPermission(b, permission))) return true
    return false
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? []
    return type === "Bearer" ? token : undefined
  }
}
