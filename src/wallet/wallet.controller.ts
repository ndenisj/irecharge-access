import { Body, Controller, HttpStatus, Param, ParseIntPipe, Post } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { FundWalletDto } from './dtos/fund-wallet.dto';
import { ApiResponse, createApiResponse } from 'shared';

@Controller('wallets')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post('/:id/add-funds')
  async addFundsToWallet(@Param('id') id: string, @Body() fundWalletDto: FundWalletDto):Promise<ApiResponse<any>> {
    try {
      const wallet = await this.walletService.addFunds(id, fundWalletDto.amount);

      return createApiResponse<any>(
        true,
        HttpStatus.OK,
        'Wallet funded successfully',
        wallet,
      );
    } catch (error) {
      return createApiResponse<any>(false, error.status, error.message, null);
    }
  }
}
