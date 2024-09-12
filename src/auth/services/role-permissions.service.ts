import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from '../../users/user.entity';
import { Role } from '../entities/role.entity';
import { RolePermission } from '../entities/role-permission.entity';
import { Resource } from '../entities/resource.entity';
import { Action } from '../entities/action.entity';
import { UpdatePermissionsDto } from '../dto/update-permissions.dto';

@Injectable()
export class RolePermissionsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(RolePermission)
    private readonly rolePermissionRepository: Repository<RolePermission>,
    @InjectRepository(Resource)
    private readonly resourceRepository: Repository<Resource>,
    @InjectRepository(Action)
    private readonly actionRepository: Repository<Action>,
  ) {}

  async getResources(): Promise<Resource[]> {
    return this.resourceRepository.find();
  }

  async getRoles(): Promise<Role[]> {
    return this.roleRepository.find();
  }

  async getRolePermissions(roleId: number): Promise<RolePermission[]> {
    return this.rolePermissionRepository.find({
      // where: { role: { id: roleId } },
      relations: ['resource', 'action'],
    });
  }

  async updatePermissions(updatePermissionsDto: UpdatePermissionsDto[]): Promise<void> {
    const rolePermissions = updatePermissionsDto.map(dto => {
      return this.rolePermissionRepository.create({
        // role: { id: dto.roleId },
        resource: { id: dto.resourceId },
      });
    });

    await this.rolePermissionRepository.save(rolePermissions);
  }

  async hasPermission(userId: number, resourceName: string, actionName: string): Promise<boolean> {
    // Find user with roles
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['roles'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Collect role IDs
    const roleIds = user.roles.map(role => role.id);

    // Find the resource by name
    const resource = await this.resourceRepository.findOne({
      where: { name: resourceName },
    });
    if (!resource) {
      throw new NotFoundException('Resource not found');
    }

    // Find the action by name
    const action = await this.actionRepository.findOne({
      where: { name: actionName },
    });
    if (!action) {
      throw new NotFoundException('Action not found');
    }

    // Check for permissions for these roles
    const rolePermissions = await this.rolePermissionRepository.find({
      where: {
        // role: { id: In(roleIds) },
        resource: { id: resource.id },
      },
    });

    return rolePermissions.length > 0;
  }
}
