import { Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { JwtModule } from "@nestjs/jwt"
import { UserModule } from "@/modules/user/user.module"
import { AuthController } from "./auth.controller"

@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET") || "default_secret_key",
        signOptions: { expiresIn: `${configService.get<number>("TOKEN_EXPIRE_TIME") || 604800}s` },
      }),
      inject: [ConfigService],
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [],
})
export class AuthModule {}
