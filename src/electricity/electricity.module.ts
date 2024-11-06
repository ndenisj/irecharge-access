import { Module } from '@nestjs/common';
import { ElectricityService } from './electricity.service';
import { ProviderAService } from './providers/provider-a.service';
import { ProviderBService } from './providers/provider-b.service';
import { SNSService } from 'src/aws/sns.service';
import { AwsModule } from 'src/aws/aws.module';

@Module({
    imports: [AwsModule],
    providers: [ProviderAService, ProviderBService, ElectricityService, SNSService],
    exports: [ElectricityService],
})
export class ElectricityModule {}
