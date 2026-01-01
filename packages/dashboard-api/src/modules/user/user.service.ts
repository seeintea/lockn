import { Inject, Injectable, Logger } from "@nestjs/common"
import { and, eq } from "drizzle-orm"
import { MYSQL_TOKEN } from "@/constants"
import { type MySqlDatabase, mysqlSchema } from "@/database"
import type { UpdateUser, User, UserWithPwd } from "./user.dto"

const { user: userSchema } = mysqlSchema

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name)
  constructor(@Inject(MYSQL_TOKEN) private readonly db: MySqlDatabase) {}

  async find(userId: User["userId"]): Promise<User>
  async find(userId: User["userId"], withPwd: boolean): Promise<UserWithPwd>
  async find(userId: User["userId"], withPwd = false) {
    this.logger.log(`find user ${userId}`)
    const users = await this.db
      .select({
        userId: userSchema.userId,
        username: userSchema.username,
        email: userSchema.email,
        phone: userSchema.phone,
        isDeleted: userSchema.isDeleted,
        isDisabled: userSchema.isDisabled,
        ...(withPwd ? { password: userSchema.password, salt: userSchema.salt } : {}),
      })
      .from(userSchema)
      .where(and(eq(userSchema.userId, userId), eq(userSchema.isDeleted, 0)))
    return users[0]
  }

  async findByUsername(username: User["username"]): Promise<UserWithPwd> {
    const users = await this.db
      .select({
        userId: userSchema.userId,
        username: userSchema.username,
        email: userSchema.email,
        phone: userSchema.phone,
        isDeleted: userSchema.isDeleted,
        isDisabled: userSchema.isDisabled,
        password: userSchema.password,
        salt: userSchema.salt,
      })
      .from(userSchema)
      .where(and(eq(userSchema.username, username), eq(userSchema.isDeleted, 0)))
    return users[0]
  }

  async create(updateUser: UpdateUser) {
    await this.db.insert(userSchema).values(updateUser)
    const user = await this.find(updateUser.userId)
    return user
  }

  async update(updateUser: UpdateUser) {
    await this.db.update(userSchema).set(updateUser).where(eq(userSchema.userId, updateUser.userId))
    return this.find(updateUser.userId)
  }

  async list() {}
}
