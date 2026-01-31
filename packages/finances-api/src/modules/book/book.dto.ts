import { createZodDto } from "nestjs-zod"
import { z } from "zod"

const shape = {
  bookId: z.string().length(32).describe("账本ID"),
  name: z.string().min(1).max(50).describe("账本名称"),
  currency: z.string().min(1).max(10).describe("币种"),
  timezone: z.string().min(1).max(50).describe("时区"),
  ownerUserId: z.string().length(32).describe("所有者用户ID"),
  isDeleted: z.boolean().describe("是否删除"),
  createTime: z.date().describe("创建时间"),
  updateTime: z.date().describe("更新时间"),
} satisfies z.ZodRawShape

const bookResponseSchema = z
  .object({
    bookId: shape.bookId,
    name: shape.name,
    currency: shape.currency,
    timezone: shape.timezone,
    ownerUserId: shape.ownerUserId,
    isDeleted: shape.isDeleted,
    createTime: shape.createTime,
    updateTime: shape.updateTime,
  })
  .meta({ id: "账本响应类型" })

const createBookSchema = z
  .object({
    name: shape.name,
    currency: shape.currency.optional(),
    timezone: shape.timezone.optional(),
    ownerUserId: shape.ownerUserId,
  })
  .meta({ id: "创建账本请求" })

const updateBookSchema = z
  .object({
    bookId: shape.bookId,
    name: shape.name.optional(),
    currency: shape.currency.optional(),
    timezone: shape.timezone.optional(),
    ownerUserId: shape.ownerUserId.optional(),
    isDeleted: shape.isDeleted.optional(),
  })
  .meta({ id: "更新账本请求" })

const deleteBookSchema = z
  .object({
    bookId: shape.bookId,
  })
  .meta({ id: "删除账本请求" })

const bookListQuerySchema = z
  .object({
    ownerUserId: shape.ownerUserId.optional(),
    name: shape.name.optional(),
  })
  .meta({ id: "查询账本列表请求" })

export class BookResponseDto extends createZodDto(bookResponseSchema) {}
export class CreateBookDto extends createZodDto(createBookSchema) {}
export class UpdateBookDto extends createZodDto(updateBookSchema) {}
export class DeleteBookDto extends createZodDto(deleteBookSchema) {}
export class BookListQueryDto extends createZodDto(bookListQuerySchema) {}

export type Book = z.infer<typeof bookResponseSchema>
export type CreateBook = z.infer<typeof createBookSchema>
export type UpdateBook = z.infer<typeof updateBookSchema>
