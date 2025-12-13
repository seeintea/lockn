import { type Provider } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import { type Schema, schema } from "../schema"

export const DRIZZLE_TOKEN = "wfs2mhR2BK4Q"

export const DrizzleProvider: Provider = {
  provide: DRIZZLE_TOKEN,
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const connectionString = configService.getOrThrow<string>("DATABASE_URL")
    const pool = new Pool({ connectionString })
    return drizzle(pool, { schema, logger: true }) as NodePgDatabase<Schema>
  },
}
