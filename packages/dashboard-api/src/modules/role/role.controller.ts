import { Body, Controller, Get, Post, Query } from "@nestjs/common"
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger"
import { ZodResponse } from "nestjs-zod"
import { Permission } from "@/common/decorators/permission.decorator"
import {
  CreateRoleDto,
  DeleteRoleDto,
  EnableRoleDto,
  PaginationRoleQueryDto,
  PaginationRoleResponseDto,
  RoleResponseDto,
  UpdateRoleDto,
} from "./role.dto"
import { RoleService } from "./role.service"

@ApiTags("角色")
@Controller("sys/role")
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post("/create")
  @Permission("sys:role:create")
  @ApiOperation({ summary: "创建角色" })
  @ZodResponse({
    type: RoleResponseDto,
  })
  async create(@Body() createRole: CreateRoleDto): Promise<RoleResponseDto> {
    return await this.roleService.create({
      ...createRole,
      isDisabled: 0,
      isDeleted: 0,
    })
  }

  @Post("/update")
  @Permission("sys:role:update")
  @ApiOperation({ summary: "更新角色" })
  @ZodResponse({
    type: RoleResponseDto,
  })
  async update(@Body() updateRole: UpdateRoleDto): Promise<RoleResponseDto> {
    return await this.roleService.update({
      ...updateRole,
    })
  }

  @Post("/enable")
  @Permission("sys:role:enable")
  @ApiOperation({ summary: "启用/禁用角色" })
  @ApiResponse({ type: Boolean })
  async enable(@Body() enableRole: EnableRoleDto): Promise<boolean> {
    const { roleId, enable } = enableRole
    const isDisabled = enable ? 0 : 1
    const role = await this.roleService.update({
      roleId,
      isDisabled,
    })
    return role.isDeleted === isDisabled
  }

  @Post("/delete")
  @Permission("sys:role:delete")
  @ApiOperation({ summary: "删除角色" })
  @ApiResponse({ type: Boolean })
  async delete(@Body() deleteRole: DeleteRoleDto): Promise<boolean> {
    const { roleId } = deleteRole
    const role = await this.roleService.update({
      roleId,
      isDeleted: 1,
    })
    return role.isDisabled === 1
  }

  @Get("/list")
  @Permission("sys:role:list")
  @ApiOperation({ summary: "查询角色列表" })
  @ZodResponse({
    type: PaginationRoleResponseDto,
  })
  async list(@Query() query: PaginationRoleQueryDto) {
    return await this.roleService.list(query)
  }
}
