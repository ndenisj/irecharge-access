
import { Module } from '@nestjs/common';
import { BillService } from './bill.service';
import { BillController } from './bill.controller';
import { DatabaseModule } from 'shared';
import { BillEntity } from './entities/bill.entity';
import { BillRepository } from './repositories/bill.repository';
import { WalletModule } from 'src/wallet/wallet.module';
import { ElectricityModule } from 'src/electricity/electricity.module';

@Module({
  imports: [DatabaseModule.forFeature([BillEntity]), WalletModule, ElectricityModule],
  controllers: [BillController],
  providers: [BillService, BillRepository],
  exports: [BillService],
})
export class BillModule {}
