import { Injectable, Scope } from "@nestjs/common"

@Injectable({ scope: Scope.DEFAULT })
export class SnowflakeService {
  private static readonly EPOCH = 1577836800000n // 自定义起始时间戳 (2020-01-01 00:00:00 UTC)
  private static readonly WORKER_ID_BITS = 5n // 机器ID位数
  private static readonly SEQUENCE_BITS = 6n // 序列号位数 (每毫秒最多生成 2^6 = 64 个ID)
  // 最大取值范围计算
  private static readonly MAX_WORKER_ID = (1n << SnowflakeService.WORKER_ID_BITS) - 1n // 31
  private static readonly MAX_SEQUENCE = (1n << SnowflakeService.SEQUENCE_BITS) - 1n // 63
  // 位移量计算
  private static readonly WORKER_ID_SHIFT = SnowflakeService.SEQUENCE_BITS
  private static readonly TIMESTAMP_LEFT_SHIFT = SnowflakeService.SEQUENCE_BITS + SnowflakeService.WORKER_ID_BITS
  private sequence = 0n
  private lastTimestamp = -1n
  private readonly workerId: bigint

  constructor() {
    const workerIdFromEnv = BigInt(process.env.SNOWFLAKE_WORKER_ID || 1)
    if (workerIdFromEnv < 0n || workerIdFromEnv > SnowflakeService.MAX_WORKER_ID) {
      throw new Error(`Worker ID must be between 0 and ${SnowflakeService.MAX_WORKER_ID}`)
    }
    this.workerId = workerIdFromEnv
  }

  private getCurrentTimestamp() {
    return BigInt(Date.now())
  }

  private waitNextMillisecond() {
    let timestamp = this.getCurrentTimestamp()
    while (timestamp <= this.lastTimestamp) {
      timestamp = this.getCurrentTimestamp()
    }
    return timestamp
  }

  id(): string {
    let timestamp = this.getCurrentTimestamp()

    if (timestamp < this.lastTimestamp) {
      const offset = this.lastTimestamp - timestamp
      if (offset <= 5n) {
        timestamp = this.waitNextMillisecond()
      } else {
        throw new Error(`Clock moved backwards. Refusing to generate ID for ${offset}ms`)
      }
    }

    if (timestamp === this.lastTimestamp) {
      this.sequence = (this.sequence + 1n) & SnowflakeService.MAX_SEQUENCE
      if (this.sequence === 0n) {
        timestamp = this.waitNextMillisecond()
      }
    } else {
      this.sequence = 0n
    }
    this.lastTimestamp = timestamp
    const timestampDiff = timestamp - SnowflakeService.EPOCH
    const id =
      (timestampDiff << SnowflakeService.TIMESTAMP_LEFT_SHIFT) |
      (this.workerId << SnowflakeService.WORKER_ID_SHIFT) |
      this.sequence
    return id.toString()
  }

  parser(id: string) {
    const bigId = BigInt(id)
    const timestamp = Number((bigId >> SnowflakeService.TIMESTAMP_LEFT_SHIFT) + SnowflakeService.EPOCH)
    const workerId = Number((bigId >> SnowflakeService.WORKER_ID_SHIFT) & SnowflakeService.MAX_WORKER_ID)
    const sequence = Number(bigId & SnowflakeService.MAX_SEQUENCE)
    return {
      timestamp,
      date: new Date(timestamp),
      workerId,
      sequence,
    }
  }
}
