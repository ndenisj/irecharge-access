import { Injectable, Logger } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@Injectable()
export class RedisLockService {
  private readonly logger = new Logger(RedisLockService.name);
  private readonly lockTTL = 30; // 30 seconds

  constructor(@InjectRedis() private readonly redis: Redis) {}

  async acquireLock(lockKey: string): Promise<boolean> {

    try {
      // Using SET with NX and EX options
      const result = await this.redis.set(lockKey, Date.now(), 'EX', this.lockTTL, 'NX');
      return result === 'OK';
    } catch (error) {
      this.logger.error(`Failed to acquire lock for key ${lockKey}: ${error.message}`);
      return false;
    }
  }

  async releaseLock(lockKey: string): Promise<void> {
    try {
      await this.redis.del(lockKey);
    } catch (error) {
      this.logger.error(`Failed to release lock for key ${lockKey}: ${error.message}`);
    }
  }

  async isLocked(lockKey: string): Promise<boolean> {
    const exists = await this.redis.exists(lockKey);
    return exists === 1;
  }
}

// import { Injectable, Inject } from '@nestjs/common';
// import { Redis } from 'ioredis';


// @Injectable()
// export class RedisLockService {
//     private readonly redisClient: Redis;

//     constructor(private readonly redisService: RedisService) {
//         this.redisClient = this.redisService.getClient();
//     }

//     async acquireLock(key: string, ttl: number = 3000): Promise<boolean> {
//         const result = await this.redisClient.set(key, 'locked', 'NX' as any, 'PX', ttl);
//         return result === 'OK';
//     }

//     async releaseLock(key: string): Promise<void> {
//         await this.redisClient.del(key);
//     }
// }
