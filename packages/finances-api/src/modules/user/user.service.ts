import { Injectable, NotFoundException } from "@nestjs/common"
import { and, eq, like } from "drizzle-orm"
import { PgService, pgSchema } from "@/database/postgresql"
import type { CreateUser, UpdateUser, User } from "./user.dto"

const { user: userSchema } = pgSchema

@Injectable()
export class UserService {
  constructor(private readonly pg: PgService) {}

  async find(userId: string): Promise<User> {
    const users = await this.pg.pdb
      .select({
        userId: userSchema.userId,
        username: userSchema.username,
        email: userSchema.email,
        phone: userSchema.phone,
        isDisabled: userSchema.isDisabled,
        isDeleted: userSchema.isDeleted,
        createTime: userSchema.createTime,
        updateTime: userSchema.updateTime,
      })
      .from(userSchema)
      .where(and(eq(userSchema.userId, userId), eq(userSchema.isDeleted, false)))
    const user = users[0]
    if (!user) throw new NotFoundException("用户不存在")
    return user
  }

  async create(values: CreateUser & { userId: string }): Promise<User> {
    await this.pg.pdb.insert(userSchema).values({
      userId: values.userId,
      username: values.username,
      password: values.password,
      salt: values.salt,
      email: values.email ?? "",
      phone: values.phone ?? "",
      isDisabled: values.isDisabled ?? false,
      isDeleted: false,
    })
    return this.find(values.userId)
  }

  async update(values: UpdateUser): Promise<User> {
    await this.pg.pdb
      .update(userSchema)
      .set({
        ...(values.username !== undefined ? { username: values.username } : {}),
        ...(values.password !== undefined ? { password: values.password } : {}),
        ...(values.salt !== undefined ? { salt: values.salt } : {}),
        ...(values.email !== undefined ? { email: values.email } : {}),
        ...(values.phone !== undefined ? { phone: values.phone } : {}),
        ...(values.isDisabled !== undefined ? { isDisabled: values.isDisabled } : {}),
        ...(values.isDeleted !== undefined ? { isDeleted: values.isDeleted } : {}),
      })
      .where(eq(userSchema.userId, values.userId))
    return this.find(values.userId)
  }

  async delete(userId: string): Promise<boolean> {
    await this.pg.pdb.update(userSchema).set({ isDeleted: true }).where(eq(userSchema.userId, userId))
    return true
  }

  async list(query: { userId?: string; username?: string }): Promise<User[]> {
    const where: Parameters<typeof and> = [eq(userSchema.isDeleted, false)]
    if (query.userId) where.push(eq(userSchema.userId, query.userId))
    if (query.username) where.push(like(userSchema.username, `%${query.username}%`))

    return this.pg.pdb
      .select({
        userId: userSchema.userId,
        username: userSchema.username,
        email: userSchema.email,
        phone: userSchema.phone,
        isDisabled: userSchema.isDisabled,
        isDeleted: userSchema.isDeleted,
        createTime: userSchema.createTime,
        updateTime: userSchema.updateTime,
      })
      .from(userSchema)
      .where(and(...where))
  }
}

