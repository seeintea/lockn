import { Body, Controller, Get, Post, Query } from "@nestjs/common"
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger"
import { ZodResponse } from "nestjs-zod"
import { Permission } from "@/common/decorators/permission.decorator"
import {
  CreateMenuDto,
  DeleteMenuDto,
  MenuResponseDto,
  MenuTreeResponseDto,
  PaginationMenuQueryDto,
  PaginationMenuResponseDto,
  UpdateMenuDto,
} from "./menu.dto"
import { MenuService } from "./menu.service"

@ApiTags("菜单")
@Controller("sys/menu")
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post("/create")
  @Permission("sys:menu:create")
  @ApiOperation({ summary: "创建菜单" })
  @ZodResponse({
    type: MenuResponseDto,
  })
  async create(@Body() createMenu: CreateMenuDto): Promise<MenuResponseDto> {
    const created = await this.menuService.create({
      ...createMenu,
      isDisabled: 0,
      isDeleted: 0,
    })
    await this.menuService.refreshRoleMenuCacheForAllRoles()
    return created
  }

  @Post("/update")
  @Permission("sys:menu:update")
  @ApiOperation({ summary: "更新菜单" })
  @ZodResponse({
    type: MenuResponseDto,
  })
  async update(@Body() updateMenu: UpdateMenuDto): Promise<MenuResponseDto> {
    const updated = await this.menuService.update(updateMenu)
    await this.menuService.refreshRoleMenuCacheForAllRoles()
    return updated
  }

  @Post("/delete")
  @Permission("sys:menu:delete")
  @ApiOperation({ summary: "删除菜单" })
  @ApiResponse({ type: Boolean })
  async delete(@Body() deleteMenu: DeleteMenuDto): Promise<boolean> {
    const ok = await this.menuService.delete(deleteMenu.menuId)
    await this.menuService.refreshRoleMenuCacheForAllRoles()
    return ok
  }

  @Get("/list")
  @Permission("sys:menu:list")
  @ApiOperation({ summary: "查询菜单列表" })
  @ZodResponse({
    type: PaginationMenuResponseDto,
  })
  async list(@Query() query: PaginationMenuQueryDto) {
    return await this.menuService.list(query)
  }

  @Get("/tree")
  @Permission("sys:menu:tree")
  @ApiOperation({ summary: "查询菜单树" })
  @ZodResponse({
    type: MenuTreeResponseDto,
  })
  async tree(): Promise<MenuTreeResponseDto> {
    return await this.menuService.tree()
  }
}
