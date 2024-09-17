import { Injectable } from '@nestjs/common';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { DataSource } from 'typeorm';

import { getEntityClassByName } from '../utils/entity-utils';

@Injectable()
export class QueryParsingService {
  constructor(private readonly dataSource: DataSource) {}

  async addRelations(
    queryBuilder: SelectQueryBuilder<any>,
    entityName: string,
    relations: string[],
  ): Promise<void> {
    const entityClass = getEntityClassByName(entityName);
    if (!entityClass) {
      throw new Error(`Entity class for "${entityName}" not found`);
    }

    const repository: Repository<any> =
      this.dataSource.getRepository(entityClass);
    const entityMetadata = repository.metadata;

    const nestedRelations = this.buildNestedRelations(relations);

    for (const [relation, nested] of Object.entries(nestedRelations)) {
      queryBuilder.leftJoinAndSelect(`${entityName}.${relation}`, relation);

      if (nested.length > 0) {
        await this.addNestedRelations(queryBuilder, relation, nested);
      }
    }
  }

  private buildNestedRelations(relations: string[]): Record<string, string[]> {
    const result: Record<string, string[]> = {};
    relations.forEach((relation) => {
      const [rel, subRel] = relation.split('.');
      if (!result[rel]) {
        result[rel] = [];
      }
      if (subRel) {
        result[rel].push(subRel);
      }
    });
    return result;
  }

  private async addNestedRelations(
    queryBuilder: SelectQueryBuilder<any>,
    alias: string,
    nestedRelations: string[],
  ): Promise<void> {
    for (const nestedRelation of nestedRelations) {
      queryBuilder.leftJoinAndSelect(
        `${alias}.${nestedRelation}`,
        nestedRelation,
      );
    }
  }
}
