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

    relations.forEach((relation) => {
      const [relationPath, nestedRelation] = relation.split('.');
      const relationExists = this.doesRelationExist(
        entityMetadata,
        relationPath,
      );

      if (!relationExists) {
        throw new Error(
          `Relation "${relationPath}" not found in entity "${entityName}"`,
        );
      }

      queryBuilder.leftJoinAndSelect(
        `${entityName}.${relationPath}`,
        relationPath,
      );

      if (nestedRelation) {
        queryBuilder.leftJoinAndSelect(
          `${relationPath}.${nestedRelation}`,
          nestedRelation,
        );
      }
    });
  }

  private doesRelationExist(
    entityMetadata: any,
    relationPath: string,
  ): boolean {
    return entityMetadata.relations.some(
      (rel: any) => rel.propertyName === relationPath,
    );
  }
}
