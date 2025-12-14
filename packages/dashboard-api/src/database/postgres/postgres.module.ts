import { Global, Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { POSTGRES_TOKEN, PostgresProvider } from "./postgres.provider"
import { PostgresService } from "./postgres.service"

@Global()
@Module({
  imports: [ConfigModule],
  providers: [PostgresProvider, PostgresService],
  exports: [PostgresService, POSTGRES_TOKEN],
})
export class PostgresModule {}
