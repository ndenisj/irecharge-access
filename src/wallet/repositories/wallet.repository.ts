import { Injectable, Logger } from "@nestjs/common";
import { EntityManager, Repository } from 'typeorm';
import { AbstractRepository } from 'shared';
import { InjectRepository } from '@nestjs/typeorm';
import { WalletEntity } from "../entities/wallet.entity";

@Injectable()
export class WalletRepository extends AbstractRepository<WalletEntity> {
  protected readonly logger = new Logger(WalletRepository.name);
  constructor(
    @InjectRepository(WalletEntity)
    dispatchPollRepository: Repository<WalletEntity>,
    entityManager: EntityManager,
  ) {
    super(dispatchPollRepository, entityManager);
  }
}
