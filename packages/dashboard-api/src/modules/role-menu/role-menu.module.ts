import { Module } from "@nestjs/common"
import { RoleMenuController } from "./role-menu.controller"
import { RoleMenuService } from "./role-menu.service"

@Module({
  imports: [],
  controllers: [RoleMenuController],
  providers: [RoleMenuService],
  exports: [RoleMenuService],
})
export class RoleMenuModule {}

