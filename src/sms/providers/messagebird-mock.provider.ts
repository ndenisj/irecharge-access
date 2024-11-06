import { Injectable, Logger } from "@nestjs/common";
import { ISmsProvider } from "../interface/sms-provider.interface";

@Injectable()
export class MessageBirdMockProvider implements ISmsProvider {
  private readonly logger = new Logger(MessageBirdMockProvider.name);

  async sendSms(phoneNumber: string, message: string): Promise<void> {
    this.logger.log(`[MessageBird Mock] Sending SMS to ${phoneNumber}: ${message}`);
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}