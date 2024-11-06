import { Logger, NotFoundException } from '@nestjs/common';
import {
  DeepPartial,
  EntityManager,
  FindManyOptions,
  FindOneOptions,
  FindOptionsRelations,
  FindOptionsWhere,
  QueryRunner,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

interface HasId {
  id: number;
}

export abstract class AbstractRepository<T extends HasId> {
  protected abstract readonly logger: Logger;

  constructor(
    private readonly entityRepository: Repository<T>,
    private readonly entityManager: EntityManager,
  ) {}

  public async save(data: DeepPartial<T>): Promise<T> {
    return await this.entityRepository.save(data);
  }

  public async saveMany(data: DeepPartial<T>[]): Promise<T[]> {
    return await this.entityRepository.save(data);
  }

  public create(data: DeepPartial<T>): T {
    return this.entityRepository.create(data);
  }

  public createMany(data: DeepPartial<T>[]): T[] {
    return this.entityRepository.create(data);
  }

  public async findOneById(id: any): Promise<T> {
    const options: FindOptionsWhere<T> = {
      id: id,
    };

    return await this.entityRepository.findOneBy(options);
  }

  public async findOneByIdWithRelations(
    id: any,
    relationships: string[],
  ): Promise<T> {
    const options: FindOneOptions<T> = {
      where: id,
      relations: relationships,
    };
    return await this.entityRepository.findOne(options);
  }

  public async findByCondition(filterCondition: FindOneOptions<T>): Promise<T> {
    return await this.entityRepository.findOne(filterCondition);
  }

  public async findWithRelations(relations: FindManyOptions<T>): Promise<T[]> {
    return await this.entityRepository.find(relations);
  }

  public async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    return await this.entityRepository.find(options);
  }

  public async getWithPagination(page: number, pageSize: number): Promise<T[]> {
    const skip = (page - 1) * pageSize;

    return await this.entityRepository
      .createQueryBuilder()
      .select()
      .skip(skip)
      .take(pageSize)
      .getMany();
  }

  public async getWithPaginationAndCondition(
    page: number,
    pageSize: number,
    whereCondition: object = {},
  ): Promise<T[]> {
    const skip = (page - 1) * pageSize;

    return await this.entityRepository
      .createQueryBuilder()
      .select()
      .where(whereCondition)
      .skip(skip)
      .take(pageSize)
      .getMany();
  }

  public async getWithPaginationAndRelations(
    page: number,
    pageSize: number,
    relations: string[] = [],
  ): Promise<T[]> {
    const skip = (page - 1) * pageSize;

    return await this.entityRepository.find({
      skip,
      take: pageSize,
      relations: relations,
    });
  }

  public async getWithPaginationRelationsAndWhere(
    page: number,
    pageSize: number,
    relations: string[] = [],
    whereCondition: object = {},
  ): Promise<T[]> {
    const skip = (page - 1) * pageSize;

    return await this.entityRepository.find({
      where: whereCondition,
      skip,
      take: pageSize,
      relations: relations,
    });
  }

  public async remove(data: T): Promise<T> {
    return await this.entityRepository.remove(data);
  }

  public async preload(entityLike: DeepPartial<T>): Promise<T> {
    return await this.entityRepository.preload(entityLike);
  }

  private async findOne(
    where: FindOptionsWhere<T>,
    relations?: FindOptionsRelations<T>,
  ): Promise<T> {
    const entity = await this.entityRepository.findOne({ where, relations });

    if (!entity) {
      this.logger.warn('Entity not found with filterQuery', where);
      throw new NotFoundException('Entity not found.');
    }

    return entity;
  }

  async findOneAndUpdate(
    where: FindOptionsWhere<T>,
    partialEntity: QueryDeepPartialEntity<T>,
  ) {
    const updateResult = await this.entityRepository.update(
      where,
      partialEntity,
    );

    if (!updateResult.affected) {
      this.logger.warn('Entity not found with filterQuery', where);
      throw new NotFoundException('Entity not found.');
    }

    return this.findOne(where);
  }

  async findOneAndDelete(where: FindOptionsWhere<T>) {
    await this.entityRepository.delete(where);
  }

  async merge(data: T, partialEntity: DeepPartial<T>) {
    // `data` is the existing entity that you want to update
    // `partialEntity` is the object containing the fields you want to update

    // Merge the fields from `partialEntity` into `data`
    this.entityRepository.merge(data, partialEntity);

    // Save the updated entity to the database
    return this.entityRepository.save(data);
  }

  createQueryBuilder(alias?: string) {
    return this.entityRepository.createQueryBuilder(alias);
  }

  public async saveWithTransaction(
    entity: T,
    queryRunner: QueryRunner
  ): Promise<T> {
    return await queryRunner.manager.save(this.entityRepository.target, entity);
  }

  public async findOneByConditionWithTransaction(
    filterCondition: FindOneOptions<T>,
    queryRunner: QueryRunner
  ): Promise<T> {
    return await queryRunner.manager.findOne(this.entityRepository.target, filterCondition);
  }
}
