import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigModule } from '@nestjs/config';
import { configuration } from 'config/configuration';
import { validationSchema } from 'config/validation';
import { DatabaseModule } from 'shared';
import { BillModule } from './bill/bill.module';
import { WalletModule } from './wallet/wallet.module';
import { NotificationModule } from './notification/notification.module';
import { SmsModule } from './sms/sms.module';
import { AwsModule } from './aws/aws.module';
import { ElectricityModule } from './electricity/electricity.module';
// import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/config/env/${process.env.NODE_ENV}.env`,
      isGlobal: true,
      load: [configuration],
      validationSchema,
    }),
    DatabaseModule,
    EventEmitterModule.forRoot(), BillModule, WalletModule, NotificationModule, SmsModule, AwsModule, ElectricityModule,
  ],
})
export class AppModule { }
