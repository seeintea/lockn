import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from "@nestjs/common"
import { Response } from "express"
import { BusinessException, ErrorCode } from "../exceptions"
import { ApiResponse } from "../interceptors"

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name)

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR
    let businessCode: number = ErrorCode.INTERNAL_ERROR
    let message = "Internal Server Error"

    if (exception instanceof BusinessException) {
      statusCode = exception.getStatus()
      businessCode = exception.getErrorCode()
      message = exception.message
    } else if (exception instanceof HttpException) {
      statusCode = exception.getStatus()
      businessCode = statusCode
      const resp = exception.getResponse()
      if (typeof resp === "string") {
        message = resp
      } else if (typeof resp === "object" && resp !== null) {
        const convert = resp as unknown as Record<string, unknown>
        const msg = convert?.message
        if (Array.isArray(msg)) {
          message = msg.join(", ")
        } else if (msg) {
          message = msg as string
        } else if (convert.error) {
          message = convert.error as string
        }
      }
    } else if (exception instanceof Error) {
      message = exception.message
      this.logger.error(exception.message, exception.stack)
    }

    const errorResponse: ApiResponse<null> = {
      code: businessCode,
      message: message,
      data: null,
    }

    response.status(statusCode).json(errorResponse)
  }
}
