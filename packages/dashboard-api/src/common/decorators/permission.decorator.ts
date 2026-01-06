import { SetMetadata } from "@nestjs/common"
import { PERMISSION_DECORATOR } from "@/constants"

export const Permission = (permission: string) => SetMetadata(PERMISSION_DECORATOR, permission)
