
import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { WalletRepository } from './repositories/wallet.repository';
import { DatabaseModule } from 'shared';
import { WalletEntity } from './entities/wallet.entity';
import { SeedService } from './seed.service';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [DatabaseModule.forFeature([WalletEntity])],
  controllers: [WalletController],
  exports: [WalletService],
  providers: [
    WalletService,
    WalletRepository,
    SeedService,
  ],
})
export class WalletModule { }
