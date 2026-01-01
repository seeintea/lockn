import { Global, Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { MYSQL_TOKEN } from "@/constants"
import { MysqlProvider } from "./mysql.provider"
import { MysqlService } from "./mysql.service"

@Global()
@Module({
  imports: [ConfigModule],
  providers: [MysqlProvider, MysqlService],
  exports: [MysqlProvider, MYSQL_TOKEN],
})
export class MysqlModule {}
