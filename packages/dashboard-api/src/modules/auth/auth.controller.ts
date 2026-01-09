import { Body, Controller, Post, Req } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { JwtService } from "@nestjs/jwt"
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger"
import type { Request } from "express"
import { ZodResponse } from "nestjs-zod"
import { Public } from "@/common/decorators/public.decorator"
import { BusinessException } from "@/common/exceptions/business.exception"
import { RedisService } from "@/database"
import { getSaltAndPassword } from "@/helper/password"
import { MenuService } from "@/modules/menu/menu.service"
import { UserService } from "@/modules/user/user.service"
import { UserRoleService } from "@/modules/user-role/user-role.service"
import { LoginDto, LoginResponseDto } from "./auth.dto"

@ApiTags("授权")
@Controller("sys/auth")
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly userRoleService: UserRoleService,
    private readonly menuService: MenuService,
    private jwtService: JwtService,
    private redisService: RedisService,
    private configService: ConfigService,
  ) {}

  @Public()
  @Post("login")
  @ApiOperation({ summary: "用户登录" })
  @ZodResponse({
    type: LoginResponseDto,
  })
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.userService.findByUsername(loginDto.username)
    if (!user) throw new BusinessException("用户名或密码错误，请重试")
    const { salt, password } = user
    const [_, userInputPwd] = getSaltAndPassword(loginDto.password, salt)
    if (userInputPwd !== password) throw new BusinessException("用户名或密码错误，请重试")

    const role = await this.userRoleService.findPrimaryRole(user.userId)
    if (!role?.roleId) throw new BusinessException("用户未分配角色")
    const roleId = role.roleId
    const roleName = role.roleName ?? ""

    const payload = { id: user.userId, roleId }
    const accessToken = await this.jwtService.signAsync(payload)

    const EXPIRE_TIME = Number(this.configService.getOrThrow<number>("TOKEN_EXPIRE_TIME"))
    const userKey = `auth:user:${user.userId}`
    const oldToken = await this.redisService.get(userKey)
    if (oldToken) {
      await this.redisService.del(`auth:token:${oldToken}`)
    }

    await this.menuService.refreshRoleMenuCacheForRole(roleId)

    const { password: _password, salt: _salt, ...safeUser } = user
    await this.redisService.set(
      `auth:token:${accessToken}`,
      JSON.stringify({ ...safeUser, id: user.userId, roleId, roleName }),
      EXPIRE_TIME,
    )
    await this.redisService.set(userKey, accessToken, EXPIRE_TIME)

    return {
      userId: user.userId,
      username: user.username,
      roleId,
      roleName,
      accessToken,
    }
  }

  @Post("logout")
  @ApiOperation({ summary: "用户登出" })
  @ApiResponse({ type: Boolean })
  async logout(@Req() req: Request): Promise<boolean> {
    const [type, token] = req.headers.authorization?.split(" ") ?? []
    if (type === "Bearer" && token) {
      await this.redisService.del(`auth:token:${token}`)
    }

    const user = (req as unknown as { user?: { id?: string; userId?: string } }).user
    const userId = user?.id ?? user?.userId
    if (userId) {
      const userKey = `auth:user:${userId}`
      const oldToken = await this.redisService.get(userKey)
      if (oldToken) {
        await this.redisService.del(`auth:token:${oldToken}`)
      }
      await this.redisService.del(userKey)
    }

    return true
  }
}
