import { Injectable, Scope } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { DataSource, DataSourceOptions } from 'typeorm';

import { Role } from 'src/roles/entities/role.entity';
import { Tenant } from 'src/tenant/tenant.entity';
import { User } from 'src/users/user.entity';

@Injectable({ scope: Scope.REQUEST })
export class TenantAwareDataSource extends DataSource {
  constructor(@Inject(REQUEST) private readonly request: any) {
    super({
      // TypeORM connection settings
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
      username: process.env.DATABASE_USERNAME || 'your_user',
      password: process.env.DATABASE_PASSWORD || 'your_password',
      database: process.env.DATABASE_NAME || 'your_database',
      entities: [User, Role, Tenant], // Add your entities here
      synchronize: false, // Set to false in production
    } as DataSourceOptions);
  }

  async initialize(): Promise<this> {
    // Change return type to Promise<this>
    if (!this.isInitialized) {
      await super.initialize();
    }

    // Retrieve the tenant's schema from the request
    const tenantSchema = this.request?.tenant?.schema;

    if (tenantSchema) {
      // Set the search path for the tenant's schema
      await this.query(`SET search_path TO ${tenantSchema}`);
    } else {
      console.warn('No tenant schema found in the request context.');
    }

    return this; // Return this instance
  }
}
