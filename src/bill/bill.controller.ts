import { Body, Controller, HttpStatus, Param, Post } from '@nestjs/common';
import { BillService } from './bill.service';
import { CreateBillDto } from './dtos/create-bill.dto';
import { ApiResponse, createApiResponse } from 'shared';

@Controller('electricity')
export class BillController {
  constructor(private readonly billService: BillService) {}

  @Post('verify')
  async createBill(@Body() createBillDto: CreateBillDto):Promise<ApiResponse<any>> {
    try {
      const bill = await this.billService.createElectricityBill(createBillDto);
      return createApiResponse<any>(
          true,
          HttpStatus.CREATED,
          'Bill created successfully',
          bill,
        );
      } catch (error) {
        return createApiResponse<any>(false, error.status, error.message, null);
      }
  }

  @Post('vend/:validationRef/pay')
  async payBill(@Param('validationRef') validationRef: string, @Body() data: { walletId: string }):Promise<ApiResponse<any>> {
    try {
      
      const billPayment = await  this.billService.payBill(validationRef, data.walletId);
      return createApiResponse<any>(
        true,
        HttpStatus.CREATED,
        'Payment completed successfully',
        billPayment,
      );
    } catch (error) {
      return createApiResponse<any>(false, error.status, error.message, null);
    }
  }

}
