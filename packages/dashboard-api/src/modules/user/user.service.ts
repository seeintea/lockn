import { Inject, Injectable, Logger } from "@nestjs/common"
import { and, count, eq, like, type SQL } from "drizzle-orm"
import { MYSQL_TOKEN } from "@/constants"
import { type MySqlDatabase, mysqlSchema } from "@/database"
import { createPaginatedData, getPaginationOptions } from "@/helper/pagination"
import type { PaginationUserQuery, UpdateUser, User, UserPagination, UserWithPwd } from "./user.dto"

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

  async list(params: PaginationUserQuery): Promise<UserPagination> {
    const eqItems: SQL<unknown>[] = [eq(userSchema.isDeleted, 0)]
    if (params.userId) {
      eqItems.push(eq(userSchema.userId, params.userId))
    }
    if (params.username) {
      eqItems.push(like(userSchema.username, `%${params.username}%`))
    }
    const counts = await this.db
      .select({ count: count() })
      .from(userSchema)
      .where(and(...eqItems))
    const total = counts[0].count

    const { limit, offset, page, pageSize } = getPaginationOptions(params)
    const users = await this.db
      .select({
        userId: userSchema.userId,
        username: userSchema.username,
        email: userSchema.email,
        phone: userSchema.phone,
        isDeleted: userSchema.isDeleted,
        isDisabled: userSchema.isDisabled,
      })
      .from(userSchema)
      .where(and(...eqItems))
      .limit(limit)
      .offset(offset)

    return createPaginatedData(users, total, page, pageSize)
  }
}
