import { Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { JwtModule } from "@nestjs/jwt"
import { MenuModule } from "@/modules/menu/menu.module"
import { UserModule } from "@/modules/user/user.module"
import { UserRoleModule } from "@/modules/user-role/user-role.module"
import { AuthController } from "./auth.controller"

@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>("JWT_SECRET"),
        signOptions: { expiresIn: `${configService.getOrThrow<number>("TOKEN_EXPIRE_TIME")}s` },
      }),
      inject: [ConfigService],
    }),
    UserModule,
    UserRoleModule,
    MenuModule,
  ],
  controllers: [AuthController],
  providers: [],
})
export class AuthModule {}
