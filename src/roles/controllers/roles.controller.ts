import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';

import { AuthGuards } from 'src/auth/guards/auth.guard';
import { QueryHelperService } from 'src/common/services/query-helper.service';
import { Permissions } from 'src/permissions/permissions.decorator';
import { Role } from 'src/roles/entities/role.entity';
import { RolesService } from 'src/roles/services/roles.service';

@Controller('roles')
export class RolesController {
  constructor(
    private readonly roleService: RolesService,
    private readonly queryHelperService: QueryHelperService,
  ) {}

  @Get(':id')
  @UseGuards(AuthGuards)
  @Permissions({ action: 'GET_ROLE' })
  async getRoleWithPermissions(
    @Param('id') id: string,
    @Query('relations') relations: any,
  ): Promise<Role> {
    console.log('test', relations);
    return this.roleService.findRole(id, relations);
  }
}
