import { Injectable, Logger } from "@nestjs/common";
import { EntityManager, Repository } from 'typeorm';
import { AbstractRepository } from 'shared';
import { InjectRepository } from '@nestjs/typeorm';
import { BillEntity } from "../entities/bill.entity";

@Injectable()
export class BillRepository extends AbstractRepository<BillEntity> {
  protected readonly logger = new Logger(BillRepository.name);
  constructor(
    @InjectRepository(BillEntity)
    dispatchPollRepository: Repository<BillEntity>,
    entityManager: EntityManager,
  ) {
    super(dispatchPollRepository, entityManager);
  }
}
