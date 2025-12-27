import { createHash } from "node:crypto"
import { UserService } from "@modules/user/user.service"
import { Body, Controller, Post } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { ApiTags } from "@nestjs/swagger"
import { LoginDto, LoginResponse } from "./auth.dto"

@ApiTags("授权")
@Controller("sys/auth")
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  @Post("login")
  async login(@Body() loginDto: LoginDto): Promise<LoginResponse> {
    const user = await this.userService.findByUsername(loginDto.username)
    if (!user) throw Error("用户名或密码错误，请重试")
    const { salt, password } = user
    const userInputPwd = createHash("sha256").update(`${loginDto.password}${salt}`).digest("hex")
    if (userInputPwd !== password) throw Error("用户名或密码错误，请重试")
    const payload = { id: user.userId }
    return {
      userId: user.userId,
      username: user.username,
      accessToken: await this.jwtService.signAsync(payload),
    }
  }
}
