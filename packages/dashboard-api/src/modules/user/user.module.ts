import { SnowflakeService } from "@common/utils"
import { Module } from "@nestjs/common"
import { UserController } from "./user.controller"
import { UserService } from "./user.service"

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService, SnowflakeService],
  exports: [UserService],
})
export class UserModule {}
