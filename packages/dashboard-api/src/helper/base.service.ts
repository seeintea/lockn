import { type MySqlDatabase } from "@/database"

export abstract class BaseService {
  constructor(protected readonly db: MySqlDatabase) {}

  abstract find(id: unknown): Promise<unknown>
  abstract create(payload: unknown): Promise<unknown>
  abstract update(payload: unknown): Promise<unknown>
}
