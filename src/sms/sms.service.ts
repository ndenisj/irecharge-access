import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ISmsProvider } from './interface/sms-provider.interface';
import { TwilioMockProvider } from './providers/twilio-mock.provider';
import { MessageBirdMockProvider } from './providers/messagebird-mock.provider';

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private provider: ISmsProvider;
  private readonly retryAttempts: number;
  private readonly retryDelay: number;

  constructor(
    private readonly configService: ConfigService,
    private readonly twilioProvider: TwilioMockProvider,
    private readonly messageBirdProvider: MessageBirdMockProvider,
  ) {
    this.retryAttempts = this.configService.get<number>('SMS_RETRY_ATTEMPTS', 3);
    this.retryDelay = this.configService.get<number>('SMS_RETRY_DELAY', 1000);
    const defaultProvider = this.configService.get<string>('SMS_PROVIDER', 'twilio');
    this.setProvider(defaultProvider);
  }

  setProvider(providerName: string): void {
    if (!providerName) {
      throw new Error('Provider name cannot be empty');
    }

    switch (providerName.toLowerCase()) {
      case 'twilio':
        this.provider = this.twilioProvider;
        break;
      case 'messagebird':
        this.provider = this.messageBirdProvider;
        break;
      default:
        throw new Error(`Unsupported SMS provider: ${providerName}`);
    }
  }

  async sendSms(phoneNumber: string, message: string): Promise<void> {
    if (!phoneNumber || !message) {
      throw new Error('Phone number and message are required');
    }

    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        await this.provider.sendSms(phoneNumber, message);
        this.logger.log(`SMS sent successfully to ${phoneNumber}`);
        return;
      } catch (error) {
        this.logger.error(
          `Failed to send SMS (attempt ${attempt}/${this.retryAttempts}): ${error.message}`,
        );

        // If this is the last attempt, throw an error
        if (attempt === this.retryAttempts) {
          throw new Error(`Failed to send SMS after ${this.retryAttempts} attempts: ${error.message}`);
        }

        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, this.retryDelay));
      }
    }
  }

  getCurrentProvider(): ISmsProvider {
    return this.provider;
  }
}
