import { Body, Controller, Get, Post, Query } from "@nestjs/common"
import { ApiOperation, ApiTags } from "@nestjs/swagger"
import { nanoid } from "nanoid"
import { ZodResponse } from "nestjs-zod"
import {
  BookMemberListQueryDto,
  BookMemberPageResponseDto,
  BookMemberResponseDto,
  CreateBookMemberDto,
  DeleteBookMemberDto,
  UpdateBookMemberDto,
} from "./book-member.dto"
import { BookMemberService } from "./book-member.service"

@ApiTags("账本成员")
@Controller("ff/book-member")
export class BookMemberController {
  constructor(private readonly bookMemberService: BookMemberService) {}

  @Post("create")
  @ApiOperation({ summary: "创建账本成员" })
  @ZodResponse({ type: BookMemberResponseDto })
  async create(@Body() body: CreateBookMemberDto) {
    return this.bookMemberService.create({ ...body, memberId: nanoid(32) })
  }

  @Get("find")
  @ApiOperation({ summary: "查询账本成员" })
  @ZodResponse({ type: BookMemberResponseDto })
  async find(@Query("memberId") memberId: string) {
    return this.bookMemberService.find(memberId)
  }

  @Get("list")
  @ApiOperation({ summary: "查询账本成员列表" })
  @ZodResponse({ type: BookMemberPageResponseDto })
  async list(@Query() query: BookMemberListQueryDto) {
    return this.bookMemberService.list(query)
  }

  @Post("update")
  @ApiOperation({ summary: "更新账本成员" })
  @ZodResponse({ type: BookMemberResponseDto })
  async update(@Body() body: UpdateBookMemberDto) {
    return this.bookMemberService.update(body)
  }

  @Post("delete")
  @ApiOperation({ summary: "删除账本成员" })
  async delete(@Body() body: DeleteBookMemberDto) {
    return this.bookMemberService.delete(body.memberId)
  }
}
