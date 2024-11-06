import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateBillDto } from './dtos/create-bill.dto';
import { BillRepository } from './repositories/bill.repository';
import { BillEntity, BillStatus } from './entities/bill.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { WalletService } from 'src/wallet/wallet.service';
import { BillCreatedEvent, PaymentCompletedEvent } from 'src/common/events/bill.events.dto';
import { generateRef } from 'shared/utils/generator.util';
import { DataSource } from 'typeorm';

@Injectable()
export class BillService {

    protected readonly logger = new Logger(BillService.name);

    constructor(
      private readonly billRepository: BillRepository,
      private eventEmitter: EventEmitter2,
      private walletsService: WalletService,
      private dataSource: DataSource,
    ) {}


    async createElectricityBill(createBillDto: CreateBillDto): Promise<BillEntity> {
        try {
            const bill = this.billRepository.create({
              amount:  createBillDto.amount,
              meterId: createBillDto.meterId,
              status: BillStatus.PENDING,
              validationRef: generateRef(),
            });
      
            const savedBill = await this.billRepository.save(bill);
      
            this.eventEmitter.emit(
              'bill.created',
              new BillCreatedEvent(savedBill.id.toString(), savedBill.amount, savedBill.meterId),
            );
      
            return savedBill;
          } catch (error) {
            this.logger.error(`Failed to create bill: ${error.message}`);
            throw error;
          }
    }

    async getBillById(id: number): Promise<BillEntity> {
        try {
            const bill = await this.billRepository.findOneById(id);
            if (!bill) {
                throw new NotFoundException(`Bill with id ${id} not found`);
            }
            return bill;
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

  
    
    async payBill(validationRef: string, walletId: string): Promise<BillEntity> {
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
  
      try {
        const bill = await this.billRepository.findByCondition({
          where: { validationRef: validationRef },
        });
  
        if (!bill) {
          throw new NotFoundException('Bill not found');
        }
  
        // Deduct funds from wallet using transaction
        await this.walletsService.deductFundsWithTransaction(
          walletId,
          parseFloat(bill.amount.toString()),
          queryRunner
        );
  
        // Update bill status
        bill.status = BillStatus.PAID;
        const updatedBill = await this.billRepository.saveWithTransaction(bill, queryRunner);
  
        // Commit the transaction
        await queryRunner.commitTransaction();
  
        // Emit events after successful transaction
        this.eventEmitter.emit(
          'payment.completed',
          new PaymentCompletedEvent(bill.id.toString(), bill.amount, walletId)
        );
  
        return updatedBill;
  
      } catch (error) {
        // Rollback transaction on error
        await queryRunner.rollbackTransaction();
        this.logger.error(`Failed to process payment: ${error.message}`);
        throw error;
  
      } finally {
        // Release the query runner
        await queryRunner.release();
      }
    }
}
