
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum BillStatus {
  PENDING = 'Pending',
  PAID = 'Paid',
}

@Entity('bills')
export class BillEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'varchar', length: 50 })
  meterId: string;

  @Column({
    type: 'enum',
    enum: BillStatus,
    default: BillStatus.PENDING
  })
  status: string;

  @Column({ nullable: true })
  validationRef: string;

}