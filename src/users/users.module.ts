import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RolePermissionsService } from 'src/roles/services/role-permissions.service';

import { AuthModule } from '../auth/auth.module';
import { Role } from '../roles/entities/role.entity';
import { RolePermission } from '../roles/entities/role-permission.entity';
import { RolesService } from '../roles/services/roles.service';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([User, Role, RolePermission]),
    JwtModule,
  ],
  providers: [UsersService, RolesService, RolePermissionsService],
  controllers: [UsersController],
  exports: [UsersService, RolesService, RolePermissionsService],
})
export class UsersModule {}
