import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
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
  providers: [],
  exports: [],
})
export class AppModule {}
