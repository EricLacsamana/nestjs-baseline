import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { QueryParsingService } from 'src/common/services/query-parsing.service';
import { RequestContextService } from 'src/request-context/request-context.service';

import { Role } from '../../roles/entities/role.entity';
import { RolePermission } from '../../roles/entities/role-permission.entity';

type RoleParams = {
  param: string;
  relations: string[];
  nestedRelations: Record<string, string[]>;
};

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(RolePermission)
    private readonly rolePermissionRepository: Repository<
      RolePermission & { permissions: RolePermission[] }
    >,
    // private readonly queryParsingService: QueryParsingService,
  ) {}

  async findRoleByParam(param: string, includes: string[] = []): Promise<Role> {
    const queryBuilder = this.roleRepository.createQueryBuilder('role');

    // Add relations if provided
    // if (includes.length > 0) {
    //   this.queryParsingService.addRelations(queryBuilder, 'role', includes);
    // }

    // Determine if the param is numeric or a string
    const roleId = parseInt(param, 10);
    if (!isNaN(roleId)) {
      queryBuilder.where('role.id = :id', { id: roleId });
    } else {
      queryBuilder.where('role.identifier = :identifier', {
        identifier: param,
      });
    }

    const role = await queryBuilder.getOne();

    if (!role) {
      throw new NotFoundException(
        `Role not found for the given parameter: ${param}`,
      );
    }

    return role;
  }
  async findRole(param: string): Promise<Role> {
    const role = null;

    if (!role) {
      throw new NotFoundException(
        `Role not found for the given parameter: ${param}`,
      );
    }

    return role;
  }

  // async findRole({
  //   param,
  //   relations,
  //   nestedRelations,
  // }: RoleParams): Promise<Role> {
  //   const includes = this.requestContextService.getIncludes();
  //   const role = await this.roleRepository.findRoleByParam(param, includes);

  //   // const queryBuilder = this.roleRepository.createQueryBuilder('role');

  //   // // Add direct relations
  //   // relations.forEach((relation) => {
  //   //   queryBuilder.leftJoinAndSelect(`role.${relation}`, relation);
  //   // });

  //   // // Add nested relations
  //   // await this.queryBuilderService.addNestedRelations(
  //   //   queryBuilder,
  //   //   'role',
  //   //   nestedRelations,
  //   // );

  //   // const roleId = parseInt(param, 10);
  //   // if (!isNaN(roleId)) {
  //   //   queryBuilder.where('role.id = :id', { id: roleId });
  //   // } else {
  //   //   queryBuilder.where('role.identifier = :identifier', {
  //   //     identifier: param,
  //   //   });
  //   // }

  //   // const role = await queryBuilder.getOne();

  //   // if (!role) {
  //   //   throw new NotFoundException(
  //   //     `Role not found for the given parameter: ${param}`,
  //   //   );
  //   // }

  //   return role;

  //   // const roleId = parseInt(param, 10);

  //   // if (!isNaN(roleId)) {
  //   //   // Query by id
  //   //   role = await this.roleRepository.findOne({
  //   //     where: {
  //   //       id: roleId,
  //   //     },
  //   //     relations,
  //   //   });
  //   // } else if (typeof param === 'string') {
  //   //   // Query by identifier
  //   //   role = await this.roleRepository.findOne({
  //   //     where: {
  //   //       identifier: param,
  //   //     },
  //   //     relations,
  //   //   });
  //   // }

  //   // if (!role) {
  //   //   throw new NotFoundException(
  //   //     `Role not found for the given parameter: ${param}`,
  //   //   );
  //   // }

  //   // return role;
  // }

  // Other service methods...
}
