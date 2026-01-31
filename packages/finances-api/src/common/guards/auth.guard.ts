import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { JwtService } from "@nestjs/jwt"
import { and, eq } from "drizzle-orm"
import type { Request } from "express"
import { PUBLIC_DECORATOR } from "@/constants/auth.constants"
import { PgService, pgSchema } from "@/database/postgresql"
import { RedisService } from "@/database/redis/redis.service"

type JwtPayload = { userId?: string; exp?: number; iat?: number }
type AuthUser = { userId: string; username: string }

const { book: bookSchema, bookMember: bookMemberSchema } = pgSchema

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    private readonly redisService: RedisService,
    private readonly pg: PgService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const targets = [context.getHandler(), context.getClass()]
    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_DECORATOR, targets)
    if (isPublic) return true

    const request = context.switchToHttp().getRequest<Request>()
    if (this.isSwaggerRequest(request)) return true

    const token = this.extractBearerToken(request)
    if (!token) throw new UnauthorizedException()

    const payload = (await this.jwtService.verifyAsync(token, { secret: process.env.JWT_SECRET })) as JwtPayload
    if (!payload?.userId) throw new UnauthorizedException()

    const cached = await this.redisService.get(`auth:token:${token}`)
    if (!cached) throw new UnauthorizedException("Token invalid or expired")

    const user = JSON.parse(cached) as AuthUser
    ;(request as unknown as { user?: AuthUser }).user = user

    if (this.isFinanceRequest(request) && !this.isFinanceBookOpenEndpoint(request)) {
      const bookId = this.extractBookId(request)
      if (!bookId) throw new BadRequestException("bookId is required")
      ;(request as unknown as { bookId?: string }).bookId = bookId
      await this.assertBookAccess(user.userId, bookId)
    }
    return true
  }

  private isSwaggerRequest(request: Request): boolean {
    const url = request.originalUrl || request.url || ""
    return url.startsWith("/swagger") || url.startsWith("/swagger/")
  }

  private isFinanceRequest(request: Request): boolean {
    const url = request.originalUrl || request.url || ""
    return url.startsWith("/api/ff/") || url.startsWith("/ff/")
  }

  private isFinanceBookOpenEndpoint(request: Request): boolean {
    const url = request.originalUrl || request.url || ""
    return (
      url.startsWith("/api/ff/book/list") ||
      url.startsWith("/api/ff/book/create") ||
      url.startsWith("/ff/book/list") ||
      url.startsWith("/ff/book/create")
    )
  }

  private extractBookId(request: Request): string | undefined {
    const queryBookId = (request.query as Record<string, unknown> | undefined)?.bookId
    if (typeof queryBookId === "string" && queryBookId.length > 0) return queryBookId
    const bodyBookId = (request.body as Record<string, unknown> | undefined)?.bookId
    if (typeof bodyBookId === "string" && bodyBookId.length > 0) return bodyBookId
    const headerBookId = request.headers["x-book-id"]
    if (typeof headerBookId === "string" && headerBookId.length > 0) return headerBookId
    return undefined
  }

  private async assertBookAccess(userId: string, bookId: string): Promise<void> {
    const books = await this.pg.pdb
      .select({ ownerUserId: bookSchema.ownerUserId })
      .from(bookSchema)
      .where(and(eq(bookSchema.bookId, bookId), eq(bookSchema.isDeleted, false)))
    const book = books[0]
    if (!book) throw new NotFoundException("账本不存在")
    if (book.ownerUserId === userId) return

    const rows = await this.pg.pdb
      .select({ bookId: bookMemberSchema.bookId })
      .from(bookMemberSchema)
      .where(
        and(
          eq(bookMemberSchema.bookId, bookId),
          eq(bookMemberSchema.userId, userId),
          eq(bookMemberSchema.isDeleted, false),
        ),
      )
      .limit(1)
    if (!rows[0]) throw new ForbiddenException("No access to this book")
  }

  private extractBearerToken(request: Request): string | undefined {
    const authorization = request.headers.authorization
    if (!authorization) return undefined
    const [type, token] = authorization.split(" ")
    if (type !== "Bearer") return undefined
    return token
  }
}
