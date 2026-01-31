import { Body, Controller, Get, Post, Query } from "@nestjs/common"
import { ApiOperation, ApiTags } from "@nestjs/swagger"
import { nanoid } from "nanoid"
import { ZodResponse } from "nestjs-zod"
import { BookListQueryDto, BookPageResponseDto, BookResponseDto, CreateBookDto, DeleteBookDto, UpdateBookDto } from "./book.dto"
import { BookService } from "./book.service"

@ApiTags("账本")
@Controller("ff/book")
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post("create")
  @ApiOperation({ summary: "创建账本" })
  @ZodResponse({ type: BookResponseDto })
  async create(@Body() body: CreateBookDto) {
    return this.bookService.create({ ...body, bookId: nanoid(32) })
  }

  @Get("find")
  @ApiOperation({ summary: "查询账本" })
  @ZodResponse({ type: BookResponseDto })
  async find(@Query("bookId") bookId: string) {
    return this.bookService.find(bookId)
  }

  @Get("list")
  @ApiOperation({ summary: "查询账本列表" })
  @ZodResponse({ type: BookPageResponseDto })
  async list(@Query() query: BookListQueryDto) {
    return this.bookService.list(query)
  }

  @Post("update")
  @ApiOperation({ summary: "更新账本" })
  @ZodResponse({ type: BookResponseDto })
  async update(@Body() body: UpdateBookDto) {
    return this.bookService.update(body)
  }

  @Post("delete")
  @ApiOperation({ summary: "删除账本" })
  async delete(@Body() body: DeleteBookDto) {
    return this.bookService.delete(body.bookId)
  }
}
