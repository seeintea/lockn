import { Inject, Injectable } from "@nestjs/common"
import type { MySql2Database } from "drizzle-orm/mysql2"
import { MYSQL_TOKEN } from "@/constants"
import type { Schema } from "./schema"

@Injectable()
export class MysqlService {
  constructor(
    @Inject(MYSQL_TOKEN)
    readonly mdb: MySql2Database<Schema>,
  ) {}
}
