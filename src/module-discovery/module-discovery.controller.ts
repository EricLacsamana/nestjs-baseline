import { Controller, Get } from '@nestjs/common';

import { ModuleDiscoveryService } from './module-discovery.service';
import {
  DiscoverModulesResponse,
  GetModulesResponse,
} from './module-discovery.types';

@Controller('modules')
export class ModuleDiscoveryController {
  constructor(
    private readonly moduleDiscoveryService: ModuleDiscoveryService,
  ) {}

  // Endpoint to discover modules and their routes
  @Get('discover')
  async discoverModules(): Promise<DiscoverModulesResponse> {
    return this.moduleDiscoveryService.discoverModules();
  }

  // Endpoint to retrieve the discovered modules
  @Get()
  getModules(): GetModulesResponse {
    return this.moduleDiscoveryService.getModules();
  }
}
