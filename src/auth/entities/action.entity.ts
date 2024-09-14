// src/auth/action.entity.ts
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { RolePermission } from '../../roles/entities/role-permission.entity';
// import { Module } from './module.entity';
import { Resource } from './resource.entity';

@Entity()
export class Action {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string; // E.g., 'Create User', 'Edit User', 'Delete User'

  @Column({ unique: true })
  identifier: string; // E.g., 'create-user', 'edit-user', 'delete-user'

  @ManyToMany(() => Resource, (resource) => resource.actions)
  roles: Resource[];
}
