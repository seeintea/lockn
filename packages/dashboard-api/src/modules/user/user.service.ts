import { type PgDatabase, POSTGRES_TOKEN, pgSchema } from "@database"
import { Inject, Injectable } from "@nestjs/common"
import { eq } from "drizzle-orm"
import { InsertUser, User } from "./user.dto"

const { users } = pgSchema

@Injectable()
export class UserService {
  constructor(@Inject(POSTGRES_TOKEN) private readonly db: PgDatabase) {}

  async create(insertUser: InsertUser): Promise<User> {
    const result = await this.db.insert(users).values(insertUser).returning()
    return result[0]
  }

  async get(id: number): Promise<User> {
    const result = await this.db.select().from(users).where(eq(users.id, id))
    return result[0]
  }

  async list(): Promise<User[]> {
    const result = await this.db.select().from(users)
    return result
  }
}
