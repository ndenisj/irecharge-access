export class WalletUpdatedEvent {
    constructor(
      public readonly walletId: string,
      public readonly newBalance: number,
      public readonly previousBalance: number,
    ) {}
  }