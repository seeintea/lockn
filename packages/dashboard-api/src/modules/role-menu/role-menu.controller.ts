import { Body, Controller, Get, Post, Query } from "@nestjs/common"
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger"
import { ZodResponse } from "nestjs-zod"
import { Permission } from "@/common/decorators/permission.decorator"
import { MenuService } from "@/modules/menu/menu.service"
import {
  CreateRoleMenuDto,
  DeleteRoleMenuDto,
  PaginationRoleMenuQueryDto,
  PaginationRoleMenuResponseDto,
  RoleMenuResponseDto,
  UpdateRoleMenuDto,
} from "./role-menu.dto"
import { RoleMenuService } from "./role-menu.service"

@ApiTags("角色菜单关联")
@Controller("sys/role-menu")
export class RoleMenuController {
  constructor(
    private readonly roleMenuService: RoleMenuService,
    private readonly menuService: MenuService,
  ) {}

  @Post("/create")
  @Permission("sys:role-menu:create")
  @ApiOperation({ summary: "创建角色菜单关联" })
  @ZodResponse({
    type: RoleMenuResponseDto,
  })
  async create(@Body() createRoleMenu: CreateRoleMenuDto): Promise<RoleMenuResponseDto> {
    const created = await this.roleMenuService.create(createRoleMenu)
    await this.menuService.refreshRoleMenuCacheForRole(created.roleId)
    return created
  }

  @Post("/update")
  @Permission("sys:role-menu:update")
  @ApiOperation({ summary: "更新角色菜单关联" })
  @ZodResponse({
    type: RoleMenuResponseDto,
  })
  async update(@Body() updateRoleMenu: UpdateRoleMenuDto): Promise<RoleMenuResponseDto> {
    const before = await this.roleMenuService.find(updateRoleMenu.id)
    const updated = await this.roleMenuService.update(updateRoleMenu)
    const roleIds = new Set<number>()
    if (before?.roleId) roleIds.add(before.roleId)
    if (updated.roleId) roleIds.add(updated.roleId)
    for (const roleId of roleIds) {
      await this.menuService.refreshRoleMenuCacheForRole(roleId)
    }
    return updated
  }

  @Post("/delete")
  @Permission("sys:role-menu:delete")
  @ApiOperation({ summary: "删除角色菜单关联" })
  @ApiResponse({ type: Boolean })
  async delete(@Body() deleteRoleMenu: DeleteRoleMenuDto): Promise<boolean> {
    const before = await this.roleMenuService.find(deleteRoleMenu.id)
    const ok = await this.roleMenuService.delete(deleteRoleMenu.id)
    if (before?.roleId) {
      await this.menuService.refreshRoleMenuCacheForRole(before.roleId)
    }
    return ok
  }

  @Get("/list")
  @Permission("sys:role-menu:list")
  @ApiOperation({ summary: "查询角色菜单关联列表" })
  @ZodResponse({
    type: PaginationRoleMenuResponseDto,
  })
  async list(@Query() query: PaginationRoleMenuQueryDto) {
    return await this.roleMenuService.list(query)
  }
}
