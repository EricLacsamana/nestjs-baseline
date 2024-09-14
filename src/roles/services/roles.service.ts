import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { isParsableToInt } from 'src/utils/helpers';

import { Role } from '../../roles/entities/role.entity';
import { RolePermission } from '../entities/role-permission.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(RolePermission)
    private readonly rolePermissionRepository: Repository<RolePermission>,
  ) {}
  // & { permissions: RolePermission[] }
  async getRoleWithPermissions(param: string): Promise<Role> {
    let role: Role;

    if (isParsableToInt(param)) {
      role = await this.roleRepository.findOne({
        where: {
          id: parseInt(param, 10),
        },
        relations: ['rolePermissions'],
      });
    } else if (typeof param === 'string') {
      // Query by identifier
      role = await this.roleRepository.findOne({
        where: {
          identifier: param,
        },
        relations: ['rolePermissions'],
      });
    }

    if (!role) {
      throw new NotFoundException(
        `Role not found for the given parameter: ${param}`,
      );
    }

    // const role = await this.roleRepository.findOne({
    //   where: { id: roleId },
    //   relations: ['permissions'], // This assumes 'permissions' is the relation name in the Role entity
    // });

    // if (!role) {
    //   throw new Error(`Role with ID ${roleId} not found`);
    // }

    // const permissions = await this.rolePermissionRepository.find({
    //   where: { roleId: role.id },
    // });

    return {
      ...role,
      // permissions
    };
  }

  // Other service methods...
}
