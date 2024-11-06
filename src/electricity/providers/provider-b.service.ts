import { Injectable, Logger } from '@nestjs/common';
import { ProviderStatus, ProviderResponse } from '../interfaces/provider-response.interface';
import { generateRef } from 'shared/utils/generator.util';

@Injectable()
export class ProviderBService {
  private readonly logger = new Logger(ProviderBService.name);
  readonly name = 'Provider-B';

  async processResponse(meterId: string, amount: number, reference: string): Promise<ProviderResponse> {
    this.logger.log(`Processing payment for meter ${meterId} with amount ${amount}`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simulate random response
    return {
        status: ProviderStatus.FAILED,
        message: 'Payment processed successfully',
        token: 'TOKEN-'+generateRef(),
      };
  }
}