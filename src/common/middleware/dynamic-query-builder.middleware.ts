import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { singular } from 'pluralize';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';

import { QueryParsingService } from '../services/query-parsing.service';
import { getEntityClassByName } from '../utils/entity-utils';

@Injectable()
export class DynamicQueryBuilderMiddleware implements NestMiddleware {
  constructor(
    private readonly queryParsingService: QueryParsingService,
    private readonly dataSource: DataSource,
  ) {}

  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    const entityName = req.query.entity
      ? (req.query.entity as string)
      : this.getEntityNameFromPath(req.path);

    if (!entityName) {
      return next(
        new HttpException('Entity name is required', HttpStatus.BAD_REQUEST),
      );
    }

    const singularEntityName = singular(entityName.toLowerCase());
    const entityClass = getEntityClassByName(singularEntityName);

    if (!entityClass) {
      return next(
        new HttpException(
          `Entity class for "${singularEntityName}" not found`,
          HttpStatus.NOT_FOUND,
        ),
      );
    }

    try {
      const repository: Repository<any> =
        this.dataSource.getRepository(entityClass);
      const queryBuilder: SelectQueryBuilder<any> =
        repository.createQueryBuilder(singularEntityName);

      // Process query params to add relations
      const include = req.query.include
        ? (req.query.include as string).split(',')
        : [];
      if (include.length > 0) {
        try {
          await this.queryParsingService.addRelations(
            queryBuilder,
            singularEntityName,
            include,
          );
        } catch (error) {
          return next(
            new HttpException(
              `Error processing relations for entity "${singularEntityName}": ${error.message}`,
              HttpStatus.BAD_REQUEST,
            ),
          );
        }
      }

      (req as any).queryBuilder = queryBuilder;

      next();
    } catch (error) {
      return next(
        new HttpException(
          `Error processing entity "${singularEntityName}": ${error.message}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    }
  }

  private getEntityNameFromPath(path: string): string | null {
    const match = path.match(/^\/(\w+)/);
    return match ? singular(match[1].toLowerCase()) : null;
  }
}
