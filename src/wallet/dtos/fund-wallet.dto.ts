import { IsDecimal, IsString } from "class-validator"

export class FundWalletDto {
    @IsDecimal()
    amount: number;
}