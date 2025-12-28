import { Global, Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import Redis from "ioredis"
import { REDIS_TOKEN, RedisService } from "./redis.service"

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: REDIS_TOKEN,
      useFactory: (configService: ConfigService) => {
        return new Redis({
          host: configService.get<string>("REDIS_HOST", "localhost"),
          port: configService.get<number>("REDIS_PORT", 6379),
          password: configService.get<string>("REDIS_PASSWORD"),
          db: configService.get<number>("REDIS_DB", 0),
        })
      },
      inject: [ConfigService],
    },
    RedisService,
  ],
  exports: [REDIS_TOKEN, RedisService],
})
export class RedisModule {}
