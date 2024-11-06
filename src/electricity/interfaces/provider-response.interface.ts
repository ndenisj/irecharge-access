export enum ProviderStatus {
    SUCCESS = 'SUCCESS',
    PENDING = 'PENDING',
    FAILED = 'FAILED',
  }
  
  export interface ProviderResponse {
    status: ProviderStatus;
    message: string;
    token?: string;
  }