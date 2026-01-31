import { Injectable, NotFoundException } from "@nestjs/common"
import { and, eq, like } from "drizzle-orm"
import { PgService, pgSchema } from "@/database/postgresql"
import type { Book, CreateBook, UpdateBook } from "./book.dto"

const { book: bookSchema } = pgSchema

@Injectable()
export class BookService {
  constructor(private readonly pg: PgService) {}

  async find(bookId: string): Promise<Book> {
    const books = await this.pg.pdb
      .select({
        bookId: bookSchema.bookId,
        name: bookSchema.name,
        currency: bookSchema.currency,
        timezone: bookSchema.timezone,
        ownerUserId: bookSchema.ownerUserId,
        isDeleted: bookSchema.isDeleted,
        createTime: bookSchema.createTime,
        updateTime: bookSchema.updateTime,
      })
      .from(bookSchema)
      .where(and(eq(bookSchema.bookId, bookId), eq(bookSchema.isDeleted, false)))
    const book = books[0]
    if (!book) throw new NotFoundException("账本不存在")
    return book
  }

  async create(values: CreateBook & { bookId: string }): Promise<Book> {
    await this.pg.pdb.insert(bookSchema).values({
      bookId: values.bookId,
      name: values.name,
      currency: values.currency ?? "CNY",
      timezone: values.timezone ?? "Asia/Shanghai",
      ownerUserId: values.ownerUserId,
      isDeleted: false,
    })
    return this.find(values.bookId)
  }

  async update(values: UpdateBook): Promise<Book> {
    await this.pg.pdb
      .update(bookSchema)
      .set({
        ...(values.name !== undefined ? { name: values.name } : {}),
        ...(values.currency !== undefined ? { currency: values.currency } : {}),
        ...(values.timezone !== undefined ? { timezone: values.timezone } : {}),
        ...(values.ownerUserId !== undefined ? { ownerUserId: values.ownerUserId } : {}),
        ...(values.isDeleted !== undefined ? { isDeleted: values.isDeleted } : {}),
      })
      .where(eq(bookSchema.bookId, values.bookId))
    return this.find(values.bookId)
  }

  async delete(bookId: string): Promise<boolean> {
    await this.pg.pdb.update(bookSchema).set({ isDeleted: true }).where(eq(bookSchema.bookId, bookId))
    return true
  }

  async list(query: { ownerUserId?: string; name?: string }): Promise<Book[]> {
    const where: Parameters<typeof and> = [eq(bookSchema.isDeleted, false)]
    if (query.ownerUserId) where.push(eq(bookSchema.ownerUserId, query.ownerUserId))
    if (query.name) where.push(like(bookSchema.name, `%${query.name}%`))

    return this.pg.pdb
      .select({
        bookId: bookSchema.bookId,
        name: bookSchema.name,
        currency: bookSchema.currency,
        timezone: bookSchema.timezone,
        ownerUserId: bookSchema.ownerUserId,
        isDeleted: bookSchema.isDeleted,
        createTime: bookSchema.createTime,
        updateTime: bookSchema.updateTime,
      })
      .from(bookSchema)
      .where(and(...where))
  }
}

