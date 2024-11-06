import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { SmsModule } from 'src/sms/sms.module';

@Module({
  imports: [SmsModule],
  providers: [NotificationService]
})
export class NotificationModule {}
