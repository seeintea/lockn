import { DrizzleService, schema } from "@database"
import { Injectable } from "@nestjs/common"
import { CreateUserDto, User } from "./user.dto"

@Injectable()
export class UserService {
  constructor(private readonly ds: DrizzleService) {}

  async create(createUserDto: CreateUserDto): Promise<User[]> {
    const result = await this.ds.npg.insert(schema.user).values(createUserDto).returning()
    return result
  }
}
