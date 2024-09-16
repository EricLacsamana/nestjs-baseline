// src/common/services/query-helper.service.ts

import { Injectable } from '@nestjs/common';

@Injectable()
export class QueryHelperService {
  parseIncludeParam(include: string): {
    relations: string[];
    nestedRelations: Record<string, string[]>;
  } {
    const result = { relations: [], nestedRelations: {} };

    if (include) {
      const parts = include.split(',');
      parts.forEach((part) => {
        const [relation, nested] = part.split('.');
        if (nested) {
          if (!result.nestedRelations[relation]) {
            result.nestedRelations[relation] = [];
          }
          result.nestedRelations[relation].push(nested);
        } else {
          result.relations.push(relation);
        }
      });
    }

    return result;
  }
}
