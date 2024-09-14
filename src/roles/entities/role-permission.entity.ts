// role-permission.entity.ts
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Role } from './role.entity';

@Entity()
export class RolePermission {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Role, (role) => role.rolePermissions)
  role: Role;

  // @ManyToOne(() => Permission, permission => permission.rolePermissions)
  // permission: Permission;

  @Column({ nullable: true })
  resource: string; // Ensure 'resource' column is correctly defined
}
