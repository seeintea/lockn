import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core"
import { AllExceptionsFilter } from "@/common/filters/all-exception.filter"
import { AuthGuard } from "@/common/guards/auth.guard"
import { TransformResponseInterceptor } from "@/common/interceptors/transform-response.interceptor"
import { SnowflakeService } from "@/common/utils/snowflake.service"
import { MysqlModule, RedisModule } from "@/database"
import { AuthModule, RoleModule, UserModule } from "@/modules"

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), MysqlModule, RedisModule, UserModule, AuthModule, RoleModule],
  controllers: [],
  providers: [
    SnowflakeService,
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    { provide: APP_INTERCEPTOR, useClass: TransformResponseInterceptor },
  ],
  exports: [SnowflakeService],
})
export class AppModule {}
