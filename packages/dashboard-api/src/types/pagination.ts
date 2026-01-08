import { z } from "zod"

export const paginationMetaSchema = z
  .object({
    currentCount: z.number().describe("当前页数据量"),
    total: z.number().describe("总数据量"),
    pageSize: z.number().describe("每页数据量"),
    totalPages: z.number().describe("总页数"),
    currentPage: z.number().describe("当前页码"),
    hasNextPage: z.boolean().describe("是否有下一页"),
    hasPreviousPage: z.boolean().describe("是否有上一页"),
  })
  .meta({ id: "分页元数据" })

export const paginationDataSchema = <T>(itemSchema: z.ZodSchema<T>) =>
  z.object({
    meta: paginationMetaSchema,
    items: z.array(itemSchema).describe("分页数据"),
  })

export const paginationQuerySchema = z.object({
  page: z.number().min(1).default(1),
  pageSize: z.number().min(1).max(999).default(10),
})
