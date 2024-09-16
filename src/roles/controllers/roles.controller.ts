import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';

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
  async getRoleWithPermissions(
    @Param('id') id: string,
    @Query('include') include: string,
  ): Promise<Role> {
    const includeParams = this.queryHelperService.parseIncludeParam(include);
    const { relations, nestedRelations } = includeParams;
    console.log('include', include);
    const role = this.roleService.findRole(id);
    return role;
    // return this.roleService.findRole({
    //   param: id,
    //   relations,
    //   nestedRelations,
    // });
  }
}
