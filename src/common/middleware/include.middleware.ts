import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import { RequestContextService } from 'src/request-context/request-context.service';

@Injectable()
export class IncludeMiddleware implements NestMiddleware {
  constructor(private readonly requestContextService: RequestContextService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const includeParam = req.query.include as string;
    const includes = includeParam ? includeParam.split(',') : [];
    this.requestContextService.setIncludes(includes);
    next();
  }
}
