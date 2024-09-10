// src/auth/resource.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany } from 'typeorm';
import { Role } from './role.entity';
import { RolePermission } from './role-permission.entity';


@Entity()
export class Resource {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string; // E.g., 'Task', 'Note'

  @ManyToMany(() => Role, role => role.resources)
  roles: Role[];

  @OneToMany(() => RolePermission, rolePermission => rolePermission.resource)
  rolePermissions: RolePermission[];
}
