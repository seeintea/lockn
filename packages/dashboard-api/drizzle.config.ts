import { defineConfig } from "drizzle-kit"

export default defineConfig({
  schema: "./src/database/mysql/schema/**.entity.ts",
  out: "./src/database/mysql/migrations",
  dialect: "mysql",
  dbCredentials: {
    url: process.env.MYSQL_DATABASE_URL!,
  },
})
