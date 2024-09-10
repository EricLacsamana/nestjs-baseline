import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { RolePermission } from './role-permission.entity';
import { Resource } from './resource.entity'; // Updated from Endpoint
import { Role } from './role.entity';
import { UpdatePermissionsDto } from './dto/update-permissions.dto';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get('resources')
  async getResources(): Promise<Resource[]> {
    return this.permissionsService.getResources();
  }

  @Get('roles')
  async getRoles(): Promise<Role[]> {
    return this.permissionsService.getRoles();
  }

  @Get('role/:id')
  async getRolePermissions(@Param('id') roleId: number): Promise<RolePermission[]> {
    return this.permissionsService.getRolePermissions(roleId);
  }

  @Post('update')
  async updatePermissions(@Body() updatePermissionsDto: UpdatePermissionsDto[]): Promise<void> {
    return this.permissionsService.updatePermissions(updatePermissionsDto);
  }
}
