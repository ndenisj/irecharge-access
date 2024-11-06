import { Injectable, Logger } from '@nestjs/common';
import { ProviderStatus, ProviderResponse } from '../interfaces/provider-response.interface';
import { generate } from 'rxjs';
import { generateRef } from 'shared/utils/generator.util';

@Injectable()
export class ProviderAService {
  private readonly logger = new Logger(ProviderAService.name);
  readonly name = 'Provider-A';

  async processResponse(meterId: string, amount: number, reference: string): Promise<ProviderResponse> {
    this.logger.log(`Processing payment for meter ${meterId} with amount ${amount}`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simulate random response
    return {
        status: ProviderStatus.SUCCESS,
        message: 'Payment processed successfully',
        token: 'TOKEN-'+generateRef(),
      };
   
  }
}