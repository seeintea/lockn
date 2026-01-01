import { Provider } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { drizzle, type MySql2Database } from "drizzle-orm/mysql2"
import mysql from "mysql2/promise"
import { MYSQL_TOKEN } from "@/constants"
import { type Schema, schema } from "./schema"

export type MySqlDatabase = MySql2Database<Schema>

export const MysqlProvider: Provider = {
  provide: MYSQL_TOKEN,
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    const connectionString = configService.getOrThrow<string>("MYSQL_DATABASE_URL")
    const connection = await mysql.createConnection(connectionString)
    return drizzle(connection, { schema, mode: "default", logger: true }) as MySqlDatabase
  },
}
