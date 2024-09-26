import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TenantAwareDataSource } from 'src/config/typeorm-config.service';

import { TenantController } from './tenant.controller'; // Optional if you have a controller
import { Tenant } from './tenant.entity';
import { TenantService } from './tenant.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tenant])],
  providers: [TenantAwareDataSource, TenantService],
  controllers: [TenantController], // Include this if you have a TenantController
  exports: [TenantAwareDataSource, TenantService], // Export TenantService if other modules need access
})
export class TenantModule {}
