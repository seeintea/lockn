import { Inject, Injectable } from "@nestjs/common"
import type { NodePgDatabase } from "drizzle-orm/node-postgres"
import type { Schema } from "../schema"
import { DRIZZLE_TOKEN } from "./drizzle.provider"

@Injectable()
export class DrizzleService {
  constructor(
    @Inject(DRIZZLE_TOKEN)
    readonly npg: NodePgDatabase<Schema>,
  ) {}
}
