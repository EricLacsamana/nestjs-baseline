import { Injectable } from '@nestjs/common';
import { SelectQueryBuilder } from 'typeorm';

@Injectable()
export class QueryBuilderService {
  async addNestedRelations(
    queryBuilder: SelectQueryBuilder<any>,
    alias: string,
    nestedRelations: Record<string, string[]>,
  ): Promise<void> {
    for (const [relation, nested] of Object.entries(nestedRelations)) {
      if (nested.length > 0) {
        queryBuilder.leftJoinAndSelect(`${alias}.${relation}`, relation);
        await this.addNestedRelations(
          queryBuilder,
          relation,
          this.buildNestedRelations(nested),
        );
      }
    }
  }

  private buildNestedRelations(nested: string[]): Record<string, string[]> {
    const result: Record<string, string[]> = {};
    nested.forEach((relation) => {
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
}
