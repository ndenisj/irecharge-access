export class InvalidBillException extends Error {
    constructor(message: string = 'Invalid bill') {
      super(message);
      this.name = 'InvalidBillException';
    }
  }