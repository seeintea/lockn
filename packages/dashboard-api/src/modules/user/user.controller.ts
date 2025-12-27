import { createHash } from "node:crypto"
import { SnowflakeService } from "@common/utils"
import { Body, Controller, Get, Post, Query } from "@nestjs/common"
import { ApiOperation, ApiTags } from "@nestjs/swagger"
import { nanoid } from "nanoid"
import { ZodResponse } from "nestjs-zod"
import { CreateUserDto, ResetUserPwdDto, UpdateUserDto, UpdateUserPwdDto, UserResponseDto } from "./user.dto"
import { UserService } from "./user.service"

@ApiTags("用户")
@Controller("sys/user")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly snowflakeService: SnowflakeService,
  ) {}

  generateSaltAndPassword(originPassword: string, salt?: string) {
    let nextSalt = salt
    if (!nextSalt) {
      nextSalt = nanoid(16)
    }
    const password = createHash("sha256").update(`${originPassword}${nextSalt}`).digest("hex")
    return [nextSalt, password]
  }

  @Post("create")
  @ApiOperation({ summary: "创建用户" })
  @ZodResponse({
    type: UserResponseDto,
  })
  async create(@Body() createUserDto: CreateUserDto) {
    const { password: origin, ...other } = createUserDto
    const [salt, password] = this.generateSaltAndPassword(origin)
    const user = await this.userService.create({
      ...other,
      salt,
      password,
      isDisabled: 0,
      isDeleted: 0,
      userId: this.snowflakeService.id(),
    })
    return user
  }

  @Get("find")
  @ApiOperation({ summary: "查找用户" })
  @ZodResponse({
    type: UserResponseDto,
  })
  async find(@Query("userId") userId: string) {
    return this.userService.find(userId)
  }

  @Post("update")
  @ApiOperation({ summary: "更新用户" })
  @ZodResponse({
    type: UserResponseDto,
  })
  async update(@Body() updateUserDto: UpdateUserDto) {
    const user = await this.userService.find(updateUserDto.userId as string, true)
    Object.assign(user, updateUserDto)
    return this.userService.update(user)
  }

  @Post("update/password")
  @ApiOperation({ summary: "更新密码" })
  async updatePassword(@Body() updateUserPwdDto: UpdateUserPwdDto) {
    const user = await this.userService.find(updateUserPwdDto.userId, true)
    if (!user) throw Error("查询用户失败")
    const { password, salt } = user
    const [_, valid] = this.generateSaltAndPassword(updateUserPwdDto.oldPassword, salt)
    if (valid !== password) throw Error("密码校验失败")
    const [nextSalt, nextPassword] = this.generateSaltAndPassword(updateUserPwdDto.newPassword)
    await this.userService.update({
      ...user,
      salt: nextSalt,
      password: nextPassword,
    })
  }

  @Post("update/password/reset")
  @ApiOperation({ summary: "重置密码" })
  async resetPassword(@Body() resetUserPwdDto: ResetUserPwdDto) {
    const user = await this.userService.find(resetUserPwdDto.userId)
    if (!user) throw Error("查询用户失败")
    const [nextSalt, nextPassword] = this.generateSaltAndPassword(resetUserPwdDto.newPassword)
    await this.userService.update({
      ...user,
      salt: nextSalt,
      password: nextPassword,
    })
  }

  @Get("delete")
  @ApiOperation({ summary: "删除用户" })
  async delete(@Query("userId") userId: string) {
    const user = await this.userService.find(userId, true)
    if (!user) return true
    user.isDeleted = 1
    const next = await this.userService.update(user)
    return !next
  }

  @Get("update/enable")
  @ApiOperation({ summary: "启用/禁用用户" })
  async enable(@Query("userId") userId: string) {
    const user = await this.userService.find(userId, true)
    user.isDisabled = user.isDeleted === 1 ? 0 : 1
    await this.userService.update(user)
  }
}
