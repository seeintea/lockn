import { createHash } from "node:crypto"
import { ShortSnowflakeService } from "@common/utils"
import { Body, Controller, Post } from "@nestjs/common"
import { nanoid } from "nanoid"
import type { CreateUserDto, User } from "./user.dto"
import { UserService } from "./user.service"

@Controller("sys/user")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly snowflakeService: ShortSnowflakeService,
  ) {}

  @Post("create")
  async create(@Body() createUserDto: CreateUserDto) {
    const salt = nanoid(16)
    const { password: origin, ...other } = createUserDto
    const password = createHash("sha256").update(`${origin}${salt}`).digest("hex")
    const user: Partial<User> = await this.userService.create({
      ...other,
      salt,
      password,
      isDisabled: 0,
      isDeleted: 0,
      userId: this.snowflakeService.nextId(),
    })
    delete user.password
    delete user.salt
    return user as Omit<User, "password" | "salt">
  }
}
