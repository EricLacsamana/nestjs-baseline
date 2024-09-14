import { Controller, Get, Param, UseGuards } from '@nestjs/common';

import { AuthGuards } from 'src/auth/guards/auth.guard';

import { Role } from '../entities/role.entity';
import { RolesService } from '../services/roles.service';

@Controller('roles')
export class RolesController {
  constructor(private readonly roleService: RolesService) {}

  @Get(':id')
  @UseGuards(AuthGuards)
  async getRoleWithPermissions(@Param('id') id: string): Promise<Role> {
    return this.roleService.getRoleWithPermissions(id);
  }
}
