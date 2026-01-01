import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { APP_GUARD } from "@nestjs/core"
import { AuthGuard } from "@/common/guards/auth.guard"
import { SnowflakeService } from "@/common/utils"
import { MysqlModule, RedisModule } from "@/database"
import { AuthModule, UserModule } from "@/modules"

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), MysqlModule, RedisModule, UserModule, AuthModule],
  controllers: [],
  providers: [
    SnowflakeService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  exports: [SnowflakeService],
})
export class AppModule {}
