
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('wallets') 
export class WalletEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  balance: number;

  constructor(id: number,balance: number) {
    this.balance = balance;
    this.id = id;
  }

}