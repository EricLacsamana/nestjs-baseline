import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { Role } from '../roles/entities/role.entity';
import { RolesService } from '../roles/services/roles.service';
import { RolePermission } from '../roles/entities/role-permission.entity';
import { RolePermissionsService } from 'src/roles/services/role-permissions.service';

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
