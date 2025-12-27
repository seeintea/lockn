import { SnowflakeService } from "@common/utils"
import { MysqlModule } from "@database"
import { AuthModule, UserModule } from "@modules"
import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), MysqlModule, UserModule, AuthModule],
  controllers: [],
  providers: [SnowflakeService],
  exports: [SnowflakeService],
})
export class AppModule {}
