import { createHash } from "node:crypto"
import { ShortSnowflakeService } from "@common/utils"
import { removeNullOrUndefined } from "@lockn/shared"
import { Body, Controller, Get, Post, Query } from "@nestjs/common"
import { nanoid } from "nanoid"
import type { CreateUserDto, UpdatePasswordDto, UpdateUserDto, UserUpdate } from "./user.dto"
import { UserService } from "./user.service"

@Controller("sys/user")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly snowflakeService: ShortSnowflakeService,
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
  async create(@Body() createUserDto: CreateUserDto) {
    const { password: origin, ...other } = createUserDto
    const [salt, password] = this.generateSaltAndPassword(origin)
    const user = await this.userService.create({
      ...other,
      salt,
      password,
      isDisabled: 0,
      isDeleted: 0,
      userId: this.snowflakeService.nextId(),
    })
    return user
  }

  @Get("find")
  async find(@Query("userId") userId: string) {
    return this.userService.find(userId)
  }

  @Post("update")
  async update(@Body() updateUserDto: UpdateUserDto) {
    const filterUser = removeNullOrUndefined(updateUserDto)
    const user = this.userService.find(filterUser.userId as string, true) as unknown as UserUpdate
    Object.assign(user, filterUser)
    return this.userService.update(user)
  }

  @Get("delete")
  async delete(@Query("userId") userId: string) {
    const user = await this.userService.find(userId, false)
    if (!user) return true
    user.isDeleted = 1
    const next = await this.userService.update(user as unknown as UserUpdate)
    return !next
  }

  @Post("update/password")
  async updatePassword(@Body() updatePasswordDto: UpdatePasswordDto) {
    const user = await this.userService.find(updatePasswordDto.userId, true)
    if (!user) throw Error("查询用户失败")
    const { password, salt } = user
    const [_, valid] = this.generateSaltAndPassword(updatePasswordDto.oldPassword, salt)
    if (valid !== password) throw Error("密码校验失败")
    const [nextSalt, nextPassword] = this.generateSaltAndPassword(updatePasswordDto.newPassword)
    await this.userService.update({
      ...user,
      salt: nextSalt,
      password: nextPassword,
    })
  }

  @Post("update/password/reset")
  async resetPassword(@Body() resetPasswordDto: Omit<UpdatePasswordDto, "oldPassword">) {
    const user = await this.userService.find(resetPasswordDto.userId)
    if (!user) throw Error("查询用户失败")
    const [nextSalt, nextPassword] = this.generateSaltAndPassword(resetPasswordDto.newPassword)
    await this.userService.update({
      ...user,
      salt: nextSalt,
      password: nextPassword,
    })
  }

  @Get("update/enable")
  async enable(@Query("userId") userId: string) {
    const user = await this.userService.find(userId)
    user.isDisabled = user.isDeleted === 1 ? 0 : 1
    await this.userService.update(user as unknown as UserUpdate)
  }
}
