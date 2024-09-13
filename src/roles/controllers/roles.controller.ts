import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { Role } from '../entities/role.entity';
import { RolesService } from '../services/roles.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('roles')
export class RolesController {
  constructor(private readonly roleService: RolesService) {}

  @Get(':id')
  @UseGuards(AuthGuard)
  async getRoleWithPermissions(@Param('id') id: string): Promise<Role> {
    return this.roleService.getRoleWithPermissions(id);
  }
}
