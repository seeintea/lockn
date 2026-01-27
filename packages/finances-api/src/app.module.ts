import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { PgModule } from "@/database/postgresql"

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PgModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
