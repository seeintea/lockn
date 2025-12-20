import { ShortSnowflakeService } from "@common/utils"
import { MysqlModule } from "@database"
import { UserModule } from "@modules"
import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), MysqlModule, UserModule],
  controllers: [],
  providers: [ShortSnowflakeService],
  exports: [ShortSnowflakeService],
})
export class AppModule {}
