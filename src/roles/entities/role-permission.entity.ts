// role-permission.entity.ts
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
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
