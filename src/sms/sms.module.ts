import { Module } from '@nestjs/common';
import { SmsService } from './sms.service';
import { ConfigModule } from '@nestjs/config';
import { TwilioMockProvider } from './providers/twilio-mock.provider';
import { MessageBirdMockProvider } from './providers/messagebird-mock.provider';

@Module({
  imports: [ConfigModule],
  providers: [SmsService, TwilioMockProvider, MessageBirdMockProvider],
  exports: [SmsService],
})
export class SmsModule {}
