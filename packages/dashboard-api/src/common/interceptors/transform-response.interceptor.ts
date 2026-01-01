import { type CallHandler, type ExecutionContext, Injectable, type NestInterceptor } from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { map, type Observable } from "rxjs"
import { CUSTOM_RESPONSE } from "@/constants"
import type { ApiResponse } from "@/types"

@Injectable()
export class TransformResponseInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept<T>(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    const isCustomResponse = this.reflector.get<boolean>(CUSTOM_RESPONSE, context.getHandler())

    if (isCustomResponse) {
      return next.handle()
    }

    return next.handle().pipe(
      map(
        (data): ApiResponse<T> => ({
          code: 200,
          message: "success",
          data,
        }),
      ),
    )
  }
}
