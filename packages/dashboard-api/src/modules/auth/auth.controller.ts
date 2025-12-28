import { createHash } from "node:crypto"
import { BusinessException } from "@common/exceptions"
import { UserService } from "@modules/user/user.service"
import { Body, Controller, Post } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { ApiTags } from "@nestjs/swagger"
import { Public } from "@/common/decorators/public.decorator"
import { RedisService } from "../../database/redis/redis.service"
import { LoginDto, LoginResponse } from "./auth.dto"

@ApiTags("授权")
@Controller("sys/auth")
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
    private redisService: RedisService,
  ) {}

  @Public()
  @Post("login")
  async login(@Body() loginDto: LoginDto): Promise<LoginResponse> {
    const user = await this.userService.findByUsername(loginDto.username)
    if (!user) throw new BusinessException("用户名或密码错误，请重试")
    const { salt, password } = user
    const userInputPwd = createHash("sha256").update(`${loginDto.password}${salt}`).digest("hex")
    if (userInputPwd !== password) throw new BusinessException("用户名或密码错误，请重试")

    const payload = { id: user.userId }
    const accessToken = await this.jwtService.signAsync(payload)

    const EXPIRE_TIME = 60 * 60 * 24 * 7
    await this.redisService.set(`auth:token:${user.userId}`, accessToken, EXPIRE_TIME)

    return {
      userId: user.userId,
      username: user.username,
      accessToken,
    }
  }
}
