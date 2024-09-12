import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../entities/role.entity';
import { RolePermission } from '../entities/role-permission.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    // @InjectRepository(RolePermission)
    // private readonly rolePermissionRepository: Repository<RolePermission>,
  ) {}
  // & { permissions: RolePermission[] }
  async getRoleWithPermissions(param: number | string): Promise<Role> {
    let role: Role;
  
    if (typeof param === 'number') {
      // Query by id
      role = await this.roleRepository.findOne({ 
        where: { 
          id: param, 
        }, 
        // relations: ['permissions'],  
      });
  
    } else if (typeof param === 'string') {
      // Query by identifier
      role = await this.roleRepository.findOne({ 
        where: { 
          identifier: param, 

        }, 
        // relations: ['permissions'],  
      });
      console.log("TEST X", role);
    } else {
      throw new NotFoundException('Invalid parameter type');
    }

    if (!role) {
      throw new NotFoundException(`Role not found for the given parameter: ${param}`);
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
