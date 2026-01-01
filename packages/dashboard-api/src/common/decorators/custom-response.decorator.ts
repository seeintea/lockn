import { SetMetadata } from "@nestjs/common"
import { CUSTOM_RESPONSE } from "@/constants"

// 自定义响应装饰器
export const CustomResponse = () => SetMetadata(CUSTOM_RESPONSE, true)
