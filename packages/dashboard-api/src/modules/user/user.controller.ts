import { Body, Controller, Get, Post, Query } from "@nestjs/common"
import type { CreateUserDto } from "./user.dto"
import { UserService } from "./user.service"

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("create")
  create(@Body() createUserDto: CreateUserDto) {
    const salt: string = "1234567890123456"
    return this.userService.create({ ...createUserDto, salt })
  }

  @Get("find")
  find(@Query("id") id: number) {
    return this.userService.get(id)
  }
}
