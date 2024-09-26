// tenant.middleware.ts
import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import { TenantService } from 'src/tenant/tenant.service';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private readonly tenantService: TenantService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const host = req.headers.host;
    if (!host) {
      throw new NotFoundException('Host header is missing');
    }

    // Split the host into parts
    const [subdomain] = host.split(':')[0].split('.'); // Extract subdomain while ignoring port

    // You can handle localhost by setting a default subdomain if needed
    if (subdomain === 'localhost') {
      // Optionally, you could set a default tenant or handle it differently
      return next(); // Skip tenant checks for localhost
    }

    const tenant = await this.tenantService.findBySubdomain(subdomain);

    if (!tenant) {
      throw new NotFoundException(
        `Tenant with subdomain ${subdomain} not found`,
      );
    }

    // Set the current schema for the request
    await this.tenantService.setCurrentSchema(subdomain);

    req.tenant = tenant; // Attach the tenant object to the request
    next();
  }
}
