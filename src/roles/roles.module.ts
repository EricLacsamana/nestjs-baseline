import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { QueryHelperService } from 'src/common/services/query-helper.service';

import { RolePermission } from '../roles/entities/role-permission.entity';
import { RolesController } from './controllers/roles.controller';
import { Role } from './entities/role.entity';
import { RolesService } from './services/roles.service';

@Module({
  imports: [TypeOrmModule.forFeature([Role, RolePermission]), JwtModule],
  providers: [RolesService, QueryHelperService],
  controllers: [RolesController],
  exports: [RolesService],
})
export class RolesModule {}
