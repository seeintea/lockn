import { PostgresModule } from "./postgres.module"
import type { PgDatabase } from "./postgres.provider"
import { POSTGRES_TOKEN, PostgresProvider } from "./postgres.provider"
import { PostgresService } from "./postgres.service"

import { type Schema as PgSchema, schema as pgSchema } from "./schema"

export { PostgresModule, PostgresProvider, POSTGRES_TOKEN, PostgresService, pgSchema }
export type { PgSchema, PgDatabase }
