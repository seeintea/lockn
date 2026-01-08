import { Body, Controller, Get, Post, Query } from "@nestjs/common"
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger"
import { ZodResponse } from "nestjs-zod"
import { Permission } from "@/common/decorators/permission.decorator"
import {
  CreateUserRoleDto,
  DeleteUserRoleDto,
  PaginationUserRoleQueryDto,
  PaginationUserRoleResponseDto,
  UpdateUserRoleDto,
  UserRoleResponseDto,
} from "./user-role.dto"
import { UserRoleService } from "./user-role.service"

@ApiTags("用户角色关联")
@Controller("sys/user-role")
export class UserRoleController {
  constructor(private readonly userRoleService: UserRoleService) {}

  @Post("/create")
  @Permission("sys:user-role:create")
  @ApiOperation({ summary: "创建用户角色关联" })
  @ZodResponse({
    type: UserRoleResponseDto,
  })
  async create(@Body() createUserRole: CreateUserRoleDto): Promise<UserRoleResponseDto> {
    return await this.userRoleService.create(createUserRole)
  }

  @Post("/update")
  @Permission("sys:user-role:update")
  @ApiOperation({ summary: "更新用户角色关联" })
  @ZodResponse({
    type: UserRoleResponseDto,
  })
  async update(@Body() updateUserRole: UpdateUserRoleDto): Promise<UserRoleResponseDto> {
    return await this.userRoleService.update(updateUserRole)
  }

  @Post("/delete")
  @Permission("sys:user-role:delete")
  @ApiOperation({ summary: "删除用户角色关联" })
  @ApiResponse({ type: Boolean })
  async delete(@Body() deleteUserRole: DeleteUserRoleDto): Promise<boolean> {
    const { id } = deleteUserRole
    return await this.userRoleService.delete(id)
  }

  @Get("/list")
  @Permission("sys:user-role:list")
  @ApiOperation({ summary: "查询用户角色关联列表" })
  @ZodResponse({
    type: PaginationUserRoleResponseDto,
  })
  async list(@Query() query: PaginationUserRoleQueryDto) {
    return await this.userRoleService.list(query)
  }
}
