import { IsDecimal, IsString } from "class-validator"


export class CreateBillDto {
    @IsDecimal()
    amount: number;

    @IsString()
    meterId: string;
}