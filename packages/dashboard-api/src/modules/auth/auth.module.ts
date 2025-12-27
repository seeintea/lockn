import { UserService } from "@modules/user/user.service"
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
  ],
  controllers: [AuthController],
  providers: [UserService],
})
export class AuthModule {}
