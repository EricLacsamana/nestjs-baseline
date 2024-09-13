// role-permissions.controller.ts
import {
  Controller,
  // Post,
  Get,
  Delete,
  Param,
  ParseIntPipe,
  Body,
} from '@nestjs/common';
import { RolePermissionsService } from '../services/role-permissions.service';

@Controller('role-permissions')
export class RolePermissionsController {
  constructor(
    private readonly rolePermissionsService: RolePermissionsService,
  ) {}

  // @Post('add')
  // async addPermissionToRole(
  //   @Body('roleId', ParseIntPipe) roleId: number,
  //   @Body('permissionId', ParseIntPipe) permissionId: number,
  // ) {
  //   return this.rolePermissionsService.addPermissionToRole(
  //     roleId,
  //     permissionId,
  //   );
  // }

  @Get(':roleId')
  async getRolePermissions(@Param('roleId', ParseIntPipe) roleId: number) {
    return this.rolePermissionsService.getRolePermissions(roleId);
  }

  @Delete('remove')
  async removePermissionFromRole(
    @Body('roleId', ParseIntPipe) roleId: number,
    @Body('permissionId', ParseIntPipe) permissionId: number,
  ) {
    return this.rolePermissionsService.removePermissionFromRole(
      roleId,
      permissionId,
    );
  }
}
