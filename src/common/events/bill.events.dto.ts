export class BillCreatedEvent {
    constructor(
      public readonly billId: string,
      public readonly amount: number,
      public readonly meterId: string,
    ) {}
  }
  
  export class PaymentCompletedEvent {
    constructor(
      public readonly billId: string,
      public readonly amount: number,
      public readonly walletId: string,
      public readonly token: string,
    ) {}
  }