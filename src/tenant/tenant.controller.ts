// src/tenant/tenant.controller.ts
import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';

import { TenantService } from './tenant.service';

@Controller('tenants')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Get()
  findTenant(@Req() req: any) {
    const { tenant } = req;
    console.log('TESTING', tenant);
    return this.tenantService.findBySubdomain(tenant.subdomain);
  }

  @Post()
  createTenant(
    @Body('email') email: string,
    @Body('name') name: string,
    @Body('subdomain') subdomain: string,
  ) {
    return this.tenantService.createTenant({ name, email, subdomain });
  }
}
