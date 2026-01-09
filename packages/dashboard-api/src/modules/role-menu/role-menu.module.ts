import { Module } from "@nestjs/common"
import { MenuModule } from "@/modules/menu/menu.module"
import { RoleMenuController } from "./role-menu.controller"
import { RoleMenuService } from "./role-menu.service"

@Module({
  imports: [MenuModule],
  controllers: [RoleMenuController],
  providers: [RoleMenuService],
  exports: [RoleMenuService],
})
export class RoleMenuModule {}
