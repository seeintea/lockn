import { Inject, Injectable } from "@nestjs/common"
import type { NodePgDatabase } from "drizzle-orm/node-postgres"
import { POSTGRES_TOKEN } from "./postgres.provider"
import type { Schema } from "./schema"

@Injectable()
export class PostgresService {
  constructor(
    @Inject(POSTGRES_TOKEN)
    readonly pdb: NodePgDatabase<Schema>,
  ) {}
}
