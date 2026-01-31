import { Injectable, NotFoundException } from "@nestjs/common"
import { and, eq } from "drizzle-orm"
import { toIsoString } from "@/common/utils/date"
import { PgService, pgSchema } from "@/database/postgresql"
import type { BookMember, CreateBookMember, UpdateBookMember } from "./book-member.dto"

const { bookMember: bookMemberSchema } = pgSchema

@Injectable()
export class BookMemberService {
  constructor(private readonly pg: PgService) {}

  async find(memberId: string): Promise<BookMember> {
    const members = await this.pg.pdb
      .select({
        memberId: bookMemberSchema.memberId,
        bookId: bookMemberSchema.bookId,
        userId: bookMemberSchema.userId,
        roleCode: bookMemberSchema.roleCode,
        scopeType: bookMemberSchema.scopeType,
        scope: bookMemberSchema.scope,
        isDeleted: bookMemberSchema.isDeleted,
        createTime: bookMemberSchema.createTime,
        updateTime: bookMemberSchema.updateTime,
      })
      .from(bookMemberSchema)
      .where(and(eq(bookMemberSchema.memberId, memberId), eq(bookMemberSchema.isDeleted, false)))
    const member = members[0]
    if (!member) throw new NotFoundException("账本成员不存在")
    return {
      ...member,
      createTime: toIsoString(member.createTime),
      updateTime: toIsoString(member.updateTime),
    }
  }

  async create(values: CreateBookMember & { memberId: string }): Promise<BookMember> {
    await this.pg.pdb.insert(bookMemberSchema).values({
      memberId: values.memberId,
      bookId: values.bookId,
      userId: values.userId,
      roleCode: values.roleCode,
      scopeType: values.scopeType ?? "all",
      scope: (values.scope ?? {}) as object,
      isDeleted: false,
    })
    return this.find(values.memberId)
  }

  async update(values: UpdateBookMember): Promise<BookMember> {
    await this.pg.pdb
      .update(bookMemberSchema)
      .set({
        ...(values.roleCode !== undefined ? { roleCode: values.roleCode } : {}),
        ...(values.scopeType !== undefined ? { scopeType: values.scopeType } : {}),
        ...(values.scope !== undefined ? { scope: values.scope as object } : {}),
        ...(values.isDeleted !== undefined ? { isDeleted: values.isDeleted } : {}),
      })
      .where(eq(bookMemberSchema.memberId, values.memberId))
    return this.find(values.memberId)
  }

  async delete(memberId: string): Promise<boolean> {
    await this.pg.pdb.update(bookMemberSchema).set({ isDeleted: true }).where(eq(bookMemberSchema.memberId, memberId))
    return true
  }

  async list(query: { bookId?: string; userId?: string }): Promise<BookMember[]> {
    const where: Parameters<typeof and> = [eq(bookMemberSchema.isDeleted, false)]
    if (query.bookId) where.push(eq(bookMemberSchema.bookId, query.bookId))
    if (query.userId) where.push(eq(bookMemberSchema.userId, query.userId))

    const rows = await this.pg.pdb
      .select({
        memberId: bookMemberSchema.memberId,
        bookId: bookMemberSchema.bookId,
        userId: bookMemberSchema.userId,
        roleCode: bookMemberSchema.roleCode,
        scopeType: bookMemberSchema.scopeType,
        scope: bookMemberSchema.scope,
        isDeleted: bookMemberSchema.isDeleted,
        createTime: bookMemberSchema.createTime,
        updateTime: bookMemberSchema.updateTime,
      })
      .from(bookMemberSchema)
      .where(and(...where))
    return rows.map((row) => ({
      ...row,
      createTime: toIsoString(row.createTime),
      updateTime: toIsoString(row.updateTime),
    }))
  }
}
