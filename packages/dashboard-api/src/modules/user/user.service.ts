import { MYSQL_TOKEN, type MySqlDatabase, mysqlSchema } from "@database"
import { Inject, Injectable } from "@nestjs/common"
import { and, eq } from "drizzle-orm"
import type { User, UserInsert, UserUpdate } from "./user.dto"

const { user: userSchema } = mysqlSchema

@Injectable()
export class UserService {
  constructor(@Inject(MYSQL_TOKEN) private readonly db: MySqlDatabase) {}

  async find(userId: User["userId"], withPassword = false) {
    const users = await this.db
      .select({
        userId: userSchema.userId,
        username: userSchema.username,
        deptId: userSchema.deptId,
        email: userSchema.email,
        phone: userSchema.phone,
        isDeleted: userSchema.isDeleted,
        isDisabled: userSchema.isDisabled,
        ...(withPassword
          ? {
              password: userSchema.password,
              salt: userSchema.salt,
            }
          : {}),
      })
      .from(userSchema)
      .where(and(eq(userSchema.userId, userId), eq(userSchema.isDeleted, 0)))
    return users[0] || null
  }

  async create(insertUser: UserInsert) {
    await this.db.insert(userSchema).values(insertUser)
    const user = await this.find(insertUser.userId)
    return user || null
  }

  async update(updateUser: UserUpdate) {
    await this.db.update(userSchema).set(updateUser).where(eq(userSchema.userId, updateUser.userId))
    return this.find(updateUser.userId)
  }

  async list() {}
}
