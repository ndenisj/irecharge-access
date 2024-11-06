
export class InsufficientFundsException extends Error {
  constructor(message: string = 'Insufficient funds in wallet') {
    super(message);
    this.name = 'InsufficientFundsException';
  }
}