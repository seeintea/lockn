import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core"
import { AllExceptionsFilter } from "@/common/filters/all-exception.filter"
import { TransformResponseInterceptor } from "@/common/interceptors/transform-response.interceptor"
import { PgModule } from "@/database/postgresql"
import { BookMemberModule, BookModule, PermissionModule, RoleModule, RolePermissionModule, UserModule } from "@/modules"

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PgModule,
    UserModule,
    BookModule,
    BookMemberModule,
    PermissionModule,
    RoleModule,
    RolePermissionModule,
  ],
  controllers: [],
  providers: [
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    { provide: APP_INTERCEPTOR, useClass: TransformResponseInterceptor },
  ],
  exports: [],
})
export class AppModule {}
