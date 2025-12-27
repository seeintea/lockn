import { UserModule } from "@modules/user/user.module"
import { Module } from "@nestjs/common"
import { JwtModule } from "@nestjs/jwt"
import { AuthController } from "./auth.controller"

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || "default_secret_key",
      signOptions: { expiresIn: `${60 * 60 * 24 * 7}s` },
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [],
})
export class AuthModule {}
