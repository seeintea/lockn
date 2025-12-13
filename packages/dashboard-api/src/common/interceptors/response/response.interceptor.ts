import type { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common"
import { map, type Observable } from "rxjs"
import type { ApiResponse } from "./response.interface"

export class TransformResponseInterceptor implements NestInterceptor {
  intercept<T>(_context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
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
