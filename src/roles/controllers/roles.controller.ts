import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';

import { Action } from 'src/auth/decorators/action.decorator';
import { AuthGuards } from 'src/auth/guards/auth.guard';
import { QueryHelperService } from 'src/common/services/query-helper.service';
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
  @Action('GET_ROLE')
  async getRoleWithPermissions(
    @Param('id') id: string,
    @Query('relations') relations: any,
  ): Promise<Role> {
    return this.roleService.findRole({ param: id, relations });
  }

  @Get(':id')
  @Action('GET_ROLEX')
  async getRole() {
    return [];
  }
}
