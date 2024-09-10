// src/auth/action.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany } from 'typeorm';
import { Role } from './role.entity';
import { RolePermission } from './role-permission.entity';


@Entity()
export class Action {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string; // E.g., 'create', 'edit', 'delete'

  @ManyToMany(() => Role, role => role.actions)
  roles: Role[];

  @OneToMany(() => RolePermission, rolePermission => rolePermission.action)
  rolePermissions: RolePermission[];
}
