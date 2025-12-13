import { Global, Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { DrizzleProvider } from "./drizzle/drizzle.provider"
import { DrizzleService } from "./drizzle/drizzle.service"

@Global()
@Module({
  imports: [ConfigModule],
  providers: [DrizzleProvider, DrizzleService],
  exports: [DrizzleService],
})
export class DatabaseModule {}
