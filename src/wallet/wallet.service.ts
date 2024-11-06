import { Injectable, NotFoundException } from '@nestjs/common';
import { WalletRepository } from './repositories/wallet.repository';
import { WalletEntity } from './entities/wallet.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { WalletUpdatedEvent } from 'src/common/events/wallet.events.dto';
import { InsufficientFundsException } from 'src/common/exceptions/insufficient-funds.exception';
import { QueryRunner } from 'typeorm';

@Injectable()
export class WalletService {

    constructor(
        private readonly walletRepository: WalletRepository,
        private eventEmitter: EventEmitter2,
    ) {}

    async addFunds(walletId: string, amount: number): Promise<WalletEntity> {
        const wallet = await this.walletRepository.findByCondition({
          where: { id: parseInt(walletId) },
        });
    
        if (!wallet) {
          throw new NotFoundException('Wallet not found');
        }
    
        const previousBalance = wallet.balance;

        const newWalletBal = parseFloat(amount.toString()) + parseFloat(wallet.balance.toString());
        wallet.balance = newWalletBal;

        const updatedWallet = await this.walletRepository.save(wallet);
    
        this.eventEmitter.emit(
          'wallet.updated',
          new WalletUpdatedEvent(wallet.id.toString(), updatedWallet.balance, previousBalance),
        );
    
        return updatedWallet;
      }

      async deductFundsWithTransaction(
        walletId: string,
        amount: number,
        queryRunner: QueryRunner
      ): Promise<WalletEntity> {
        const wallet = await this.walletRepository.findOneByConditionWithTransaction(
          {
            where: { id: parseInt(walletId) }
          },
          queryRunner
        );
    
        if (!wallet) {
          throw new NotFoundException('Wallet not found');
        }
    
        if (wallet.balance < amount) {
          throw new InsufficientFundsException();
        }
    
        const previousBalance = wallet.balance;
        wallet.balance -= amount;

          const updatedWallet = await this.walletRepository.saveWithTransaction(wallet, queryRunner);
    
        this.eventEmitter.emit(
          'wallet.updated',
          new WalletUpdatedEvent(wallet.id.toString(), wallet.balance, previousBalance),
        );
    
        return updatedWallet;
      }

}
