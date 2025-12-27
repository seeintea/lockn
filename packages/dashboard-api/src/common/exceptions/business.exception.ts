import { HttpException, HttpStatus } from "@nestjs/common"
import { ErrorCode } from "./error-code.enum"

export class BusinessException extends HttpException {
  private errorCode: number

  constructor(message: string, code: number = ErrorCode.COMMON_ERROR, status: HttpStatus = HttpStatus.OK) {
    super(message, status)
    this.errorCode = code
  }

  getErrorCode(): number {
    return this.errorCode
  }
}
