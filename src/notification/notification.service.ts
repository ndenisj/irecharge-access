
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BillCreatedEvent, PaymentCompletedEvent } from 'src/common/events/bill.events.dto';
import { WalletUpdatedEvent } from 'src/common/events/wallet.events.dto';
import { SmsService } from 'src/sms/sms.service';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  private readonly LOW_BALANCE_THRESHOLD = 100; // Configurable

  constructor(private readonly smsService: SmsService) {}

  @OnEvent('bill.created')
  async handleBillCreated(event: BillCreatedEvent) {
    try {
      // this.logger.log(`Bill created with ID: ${event.billId} for amount: ${event.amount} FROM NotificationService`);
      await this.smsService.sendSms(
        '+1234567890',
        `New bill created with ID: ${event.billId} for amount: ${event.amount}`,
      );
    } catch (error) {
      this.logger.error(`Failed to send bill created notification: ${error.message}`);
    }
  }

  @OnEvent('payment.completed')
  async handlePaymentCompleted(event: PaymentCompletedEvent) {
    try {
      // this.logger.log(`Payment completed for bill: ${event.billId} FROM NotificationService`);
      await this.smsService.sendSms(
        '+1234567890',
        `Payment completed. Token: ${event.token}`,
      );
    } catch (error) {
      this.logger.error(`Failed to send payment completion notification: ${error.message}`);
    }
  }

  @OnEvent('wallet.updated')
  async handleWalletUpdated(event: WalletUpdatedEvent) {
    if (event.newBalance < this.LOW_BALANCE_THRESHOLD) {
      try {
        // this.logger.log(`Low balance alert! Your wallet balance is ${event.newBalance} FROM NotificationService`);
        await this.smsService.sendSms(
          '+1234567890',
          `Low balance alert! Your wallet balance is`,
        );
      } catch (error) {
        this.logger.error(`Failed to send low balance notification: ${error.message}`);
      }
    }
  }

}