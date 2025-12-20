import { Injectable, Scope } from "@nestjs/common"

@Injectable({ scope: Scope.DEFAULT })
export class ShortSnowflakeService {
  // ################### 核心配置参数 (可根据需要调整) ###################
  // 自定义起始时间戳 (2020-01-01 00:00:00 UTC)。往前调整可增加使用年限，但会导致ID变大。
  private static readonly EPOCH = 1577836800000n

  // 机器ID位数 (支持最多 2^5 = 32 个节点)
  private static readonly WORKER_ID_BITS = 5n
  // 序列号位数 (每毫秒最多生成 2^6 = 64 个ID)
  private static readonly SEQUENCE_BITS = 6n

  // 最大取值范围计算
  private static readonly MAX_WORKER_ID = (1n << ShortSnowflakeService.WORKER_ID_BITS) - 1n // 31
  private static readonly MAX_SEQUENCE = (1n << ShortSnowflakeService.SEQUENCE_BITS) - 1n // 63

  // 位移量计算
  private static readonly WORKER_ID_SHIFT = ShortSnowflakeService.SEQUENCE_BITS
  private static readonly TIMESTAMP_LEFT_SHIFT =
    ShortSnowflakeService.SEQUENCE_BITS + ShortSnowflakeService.WORKER_ID_BITS

  // 时间戳位数为总位数减去机器ID和序列号位数，约32位，可使用约8.5年（从EPOCH算起）
  // 总位数 = 1(符号位，实际不用) + 32(时间戳) + 5(机器ID) + 6(序列号) ≈ 44位，十进制长度约13-15位

  private sequence = 0n
  private lastTimestamp = -1n
  private readonly workerId: bigint

  constructor() {
    // 从环境变量获取机器ID，确保分布式环境下每个实例的ID唯一
    const workerIdFromEnv = BigInt(process.env.SNOWFLAKE_WORKER_ID || 1)

    if (workerIdFromEnv < 0n || workerIdFromEnv > ShortSnowflakeService.MAX_WORKER_ID) {
      throw new Error(`Worker ID must be between 0 and ${ShortSnowflakeService.MAX_WORKER_ID}`)
    }

    this.workerId = workerIdFromEnv
  }

  /**
   * 生成下一个精简版雪花ID（返回字符串以避免JavaScript大数问题）
   * @returns 15-18位的纯数字ID字符串
   */
  nextId(): string {
    let timestamp = this.currentTimestamp()

    // 处理时钟回拨（简单策略：短时间回拨则等待）
    if (timestamp < this.lastTimestamp) {
      const offset = this.lastTimestamp - timestamp
      // 如果回拨时间在5毫秒内，则等待直至时间追平
      if (offset <= 5n) {
        timestamp = this.waitUntilNextMillis()
      } else {
        // 如果回拨时间过长，抛出异常
        throw new Error(`Clock moved backwards. Refusing to generate ID for ${offset}ms`)
      }
    }

    // 如果是同一毫秒内生成，则递增序列号
    if (timestamp === this.lastTimestamp) {
      this.sequence = (this.sequence + 1n) & ShortSnowflakeService.MAX_SEQUENCE

      // 如果当前毫秒内的序列号已耗尽，则等待下一毫秒
      if (this.sequence === 0n) {
        timestamp = this.waitUntilNextMillis()
      }
    } else {
      // 时间戳改变，序列号重置
      this.sequence = 0n
    }

    this.lastTimestamp = timestamp

    // 计算相对于起始时间戳的时间差
    const timestampDiff = timestamp - ShortSnowflakeService.EPOCH

    // 组合各部分生成最终ID（使用BigInt避免溢出）
    const id =
      (timestampDiff << ShortSnowflakeService.TIMESTAMP_LEFT_SHIFT) |
      (this.workerId << ShortSnowflakeService.WORKER_ID_SHIFT) |
      this.sequence

    // 返回字符串形式，避免JavaScript数字精度问题
    return id.toString()
  }

  /**
   * 获取当前时间戳（BigInt类型）
   */
  private currentTimestamp(): bigint {
    return BigInt(Date.now())
  }

  /**
   * 等待直到下一毫秒
   */
  private waitUntilNextMillis(): bigint {
    let timestamp = this.currentTimestamp()
    while (timestamp <= this.lastTimestamp) {
      // 在实际应用中，可以考虑在这里加入短暂的阻塞（如setTimeout）
      // 但为了性能，简单的循环检查通常足够
      timestamp = this.currentTimestamp()
    }
    return timestamp
  }

  /**
   * 解析ID，获取生成时间戳等信息（用于调试）
   */
  parseId(id: string) {
    const bigId = BigInt(id)
    const timestamp = Number((bigId >> ShortSnowflakeService.TIMESTAMP_LEFT_SHIFT) + ShortSnowflakeService.EPOCH)
    const workerId = Number((bigId >> ShortSnowflakeService.WORKER_ID_SHIFT) & ShortSnowflakeService.MAX_WORKER_ID)
    const sequence = Number(bigId & ShortSnowflakeService.MAX_SEQUENCE)

    return {
      timestamp,
      date: new Date(timestamp),
      workerId,
      sequence,
    }
  }
}
