// role-permissions.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Role } from './entities/role.entity';
import { RolePermission } from './entities/role-permission.entity';
import { RolePermissionsService } from './services/role-permissions.service';
// import { RolePermissionsService } from './role-permissions.service';
// import { RolePermissionsController } from './role-permissions.controller';
// import { RolePermission } from './role-permission.entity';
// import { Role } from './role.entity';
// import { Permission } from './permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RolePermission,
      Role,
      // Permission
    ]),
  ],
  providers: [RolePermissionsService],
  controllers: [RolePermission],
  exports: [RolePermissionsService], // Export if used in other modules
})
export class RolePermissionsModule {}
