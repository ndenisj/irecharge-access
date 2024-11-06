import { Injectable, Logger } from '@nestjs/common';
import { ISmsProvider } from '../interface/sms-provider.interface';

@Injectable()
export class TwilioMockProvider implements ISmsProvider {
  private readonly logger = new Logger(TwilioMockProvider.name);

  async sendSms(phoneNumber: string, message: string): Promise<void> {
    this.logger.log(`[Twilio Mock] Sending SMS to ${phoneNumber}: ${message}`);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}