import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';

import { ModuleDiscoveryController } from './module-discovery.controller';
import { ModuleDiscoveryService } from './module-discovery.service';

@Module({
  imports: [DiscoveryModule],
  providers: [ModuleDiscoveryService],
  exports: [ModuleDiscoveryService],
  controllers: [ModuleDiscoveryController],
})
export class ModuleDiscoveryModule {}
