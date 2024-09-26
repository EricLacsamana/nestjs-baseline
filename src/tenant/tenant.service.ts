// tenant.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { RegisterTenantDto } from './dto/register-tenant.dto';
import { Tenant } from './tenant.entity';

@Injectable()
export class TenantService {
  constructor(
    @InjectRepository(Tenant)
    private tenantRepository: Repository<Tenant>,
    private dataSource: DataSource,
  ) {}

  async createTenant({ subdomain, email, name }: RegisterTenantDto) {
    // Create a new schema for the tenant
    await this.dataSource.query(`CREATE SCHEMA IF NOT EXISTS "${subdomain}"`);

    // Store tenant information in the tenants table
    const tenant = this.tenantRepository.create({
      name,
      subdomain,
      email,
    });
    return this.tenantRepository.save(tenant);
  }

  async setCurrentSchema(subdomain: string) {
    await this.dataSource.query(`SET search_path TO "${subdomain}"`);
  }

  // async findBySubdomain(subdomain: string) {
  //   return this.connection.query('SELECT * FROM tenants WHERE subdomain = $1', [
  //     subdomain,
  //   ]);
  // }

  async findBySubdomain(subdomain: string): Promise<Tenant> {
    return this.tenantRepository.findOne({ where: { subdomain: subdomain } });
  }

  // async createTenant(subdomain: string) {
  //   this.tenants[subdomain] = {
  //     /* tenant data */
  //   };
  //   return this.tenants[subdomain];
  // }

  async register(registerTenantDto: RegisterTenantDto): Promise<Tenant> {
    const data = registerTenantDto;
    // const existingTenant = await this.findBySubdomain(subdomain);
    // if (existingTenant) {
    //   throw new Error('Tenant already exists');
    // }

    const newTenant = this.tenantRepository.create(data);
    return this.tenantRepository.save(newTenant);
  }
}
