import { IsDecimal, IsNumber } from "class-validator"


export class DeductFundsDto {
    @IsNumber()
    walletId: number;

    @IsNumber()
    billId: number;
}
