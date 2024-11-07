import { Module } from '@nestjs/common';
import { RedisModule as NestRedisModule } from '@nestjs-modules/ioredis';
import { ConfigService } from '@nestjs/config';
import { RedisLockService } from './redis-lock.service';

@Module({
    imports: [
        NestRedisModule.forRoot({
            type: 'single',
            url: 'redis://localhost:6379',
            options: {
                retryStrategy(times) {
                    return Math.min(times * 50, 2000);
                },
            }
        }),
    ],
    providers: [RedisLockService],
    exports: [RedisLockService],
})
export class RedisModule { }