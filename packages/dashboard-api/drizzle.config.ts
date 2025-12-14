import { defineConfig } from "drizzle-kit"

export default defineConfig({
  schema: "./src/database/postgres/schema/**.entity.ts",
  out: "./src/database/postgres/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.PG_DATABASE_URL!,
  },
})
