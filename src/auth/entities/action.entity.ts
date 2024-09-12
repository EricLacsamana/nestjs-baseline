// src/auth/action.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany } from 'typeorm';
// import { Module } from './module.entity';
import { RolePermission } from './role-permission.entity';
import { Resource } from './resource.entity';


@Entity()
export class Action {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string; // E.g., 'Create User', 'Edit User', 'Delete User'

  @Column({ unique: true })
  identifier: string; // E.g., 'create-user', 'edit-user', 'delete-user'

  @ManyToMany(() => Resource, resource => resource.actions)
  roles: Resource[];
}
