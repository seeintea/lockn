import { DatabaseModule } from "@database"
import { UserModule } from "@modules"
import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DatabaseModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
