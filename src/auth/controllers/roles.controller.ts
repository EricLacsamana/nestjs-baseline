import { Controller, Get, Param } from '@nestjs/common';
import { RolesService } from '../services/roles.service';
import { Role } from '../entities/role.entity';
import { RolePermission } from '../entities/role-permission.entity';

@Controller('roles')
export class RolesController {
  constructor(private readonly roleService: RolesService) {}

  @Get(':id')
  // & { permissions: RolePermission[] }
  async getRoleWithPermissions(@Param('id') id: number): Promise<Role> {
    return this.roleService.getRoleWithPermissions(id);
  }

  // Other controller methods...
}
