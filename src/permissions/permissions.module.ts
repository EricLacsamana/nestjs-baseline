import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';

import { PermissionsController } from './permissions.controller';
import { PermissionsService } from './permissions.service';

@Module({
  imports: [DiscoveryModule],
  providers: [PermissionsService],
  controllers: [PermissionsController],
})
export class PermissionsModule {}
