import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { WalletRepository } from "./repositories/wallet.repository";
import { WalletEntity } from "./entities/wallet.entity";



@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    private readonly walletRepository: WalletRepository,
  ) {}

  async onModuleInit() {

    const defaultWallets = [
      new WalletEntity(1,500),
      new WalletEntity(2,1500),
      new WalletEntity(3,2500),
      new WalletEntity(4,3500),
      new WalletEntity(5,4500),
    ];

    // Check for each wallet in the database and insert if it doesn’t exist
    // run the loop once before before checking


    for (const walletData of defaultWallets) {
      const existingWallet = await this.walletRepository.findOneById(walletData.id);
      if (!existingWallet) {
        const wallet = this.walletRepository.create(walletData);
        await this.walletRepository.save(wallet);
        console.log(`Seeded ${walletData.id} with balance ${walletData.balance}`);
      } else {
        console.log(`${walletData.id} already exists with balance ${existingWallet.balance}`);
      }
    }
  }
}