import { Controller, Get } from '@nestjs/common';

import { PermissionsService } from './permissions.service';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get('generate')
  async generatePermissions() {
    return this.permissionsService.generateDynamicPermissions();
  }

  @Get()
  getPermissions() {
    return this.permissionsService.getPermissions();
  }
}
