import { Injectable, Logger } from '@nestjs/common';
import { ProviderStatus, ProviderResponse } from './interfaces/provider-response.interface';
import { SNSService } from '../aws/sns.service';
import { ProviderAService } from './providers/provider-a.service';
import { ProviderBService } from './providers/provider-b.service';

@Injectable()
export class ElectricityService {
  private readonly logger = new Logger(ElectricityService.name);

  constructor(
    private readonly providerA: ProviderAService,
    private readonly providerB: ProviderBService,
    private readonly snsService: SNSService,
  ) {}

  async processSubscription(meterId: string, amount: number, reference: string): Promise<ProviderResponse> {
    try {
      const provider = meterId.startsWith('A') ? this.providerA : this.providerB;
      const response = await provider.processResponse(meterId, amount, reference);

      if (response.status === ProviderStatus.FAILED || response.status === ProviderStatus.PENDING) {
        await this.snsService.publishMessage(JSON.stringify({
          type: response.status,
          data: {
            meterId,
            amount,
            reference,
            provider: provider.name,
            message: response.message,
            timestamp: new Date().toISOString(),
          }
        }));
      }

      return response;
    } catch (error) {
      this.logger.error(`Payment processing failed: ${error.message}`);
      throw error;
    }
  }
}