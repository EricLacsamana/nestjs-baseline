import { Injectable } from '@nestjs/common';
import { SelectQueryBuilder } from 'typeorm';

@Injectable()
export class QueryBuilderService {
  async addNestedRelations(
    queryBuilder: SelectQueryBuilder<any>,
    alias: string,
    nestedRelations: Record<string, any>,
  ): Promise<void> {
    Object.entries(nestedRelations).forEach(([relation, nested]) => {
      queryBuilder.leftJoinAndSelect(`${alias}.${relation}`, relation);

      if (typeof nested === 'object' && !Array.isArray(nested)) {
        this.addNestedRelations(queryBuilder, relation, nested);
      }
    });
  }
}
