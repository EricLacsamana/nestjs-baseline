import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import { getRelationsFromInclude } from '../utils/relation-utils'; // Adjust path as necessary

@Injectable()
export class RelationMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const include = (req.query.include as string) || '';
    req.query.relations = getRelationsFromInclude(include); // Attach parsed relations to the request object
    next();
  }
}
