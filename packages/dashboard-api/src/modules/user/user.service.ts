import { MYSQL_TOKEN, type MySqlDatabase, mysqlSchema } from "@database"
import { Inject, Injectable } from "@nestjs/common"
import { eq } from "drizzle-orm"
import { User, UserInsert } from "./user.dto"

const { user: userSchema } = mysqlSchema

@Injectable()
export class UserService {
  constructor(@Inject(MYSQL_TOKEN) private readonly db: MySqlDatabase) {}

  async find(userId: User["userId"]): Promise<User> {
    const user = await this.db.select().from(userSchema).where(eq(userSchema.userId, userId))
    if (user.length) {
      return user[0]
    }
    throw new Error("查找用户失败")
  }

  async create(insertUser: UserInsert): Promise<User> {
    await this.db.insert(userSchema).values(insertUser)
    const user = await this.find(insertUser.userId)
    if (user) {
      return user
    }
    throw new Error("创建用户失败")
  }
}
