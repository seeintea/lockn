import { Provider } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import { type Schema, schema } from "./schema"

export const POSTGRES_TOKEN = Symbol("postgres_token")
export type PgDatabase = NodePgDatabase<Schema>

export const PostgresProvider: Provider = {
  provide: POSTGRES_TOKEN,
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const connectionString = configService.getOrThrow<string>("PG_DATABASE_URL")
    const pool = new Pool({ connectionString })
    return drizzle(pool, { schema, logger: true }) as PgDatabase
  },
}
