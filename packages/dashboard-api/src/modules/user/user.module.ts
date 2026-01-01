import { Module } from "@nestjs/common"
import { SnowflakeService } from "@/common/utils/snowflake.service"
import { UserController } from "./user.controller"
import { UserService } from "./user.service"

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService, SnowflakeService],
  exports: [UserService],
})
export class UserModule {}
