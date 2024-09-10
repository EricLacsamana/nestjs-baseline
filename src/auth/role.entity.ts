// src/auth/role.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany } from 'typeorm';
import { Resource } from './resource.entity';
import { Action } from './action.entity';
import { User } from '../users/user.entity';
import { RolePermission } from './role-permission.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // E.g., 'Super Admin'

  @Column({ unique: true })
  identifier: string; // E.g., 'super-admin'

  @ManyToMany(() => Resource, resource => resource.roles)
  resources: Resource[];

  @ManyToMany(() => Action, action => action.roles)
  actions: Action[];

  @ManyToMany(() => User, user => user.roles)
  users: User[];

  @OneToMany(() => RolePermission, rolePermission => rolePermission.role)
  rolePermissions: RolePermission[];
}
