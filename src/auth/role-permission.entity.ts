import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, Index } from 'typeorm';
import { Role } from './role.entity';
import { Resource } from './resource.entity';
import { Action } from './action.entity';

@Entity()
export class RolePermission {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Role, role => role.rolePermissions, { eager: true })
  role: Role;

  @ManyToOne(() => Resource, resource => resource.rolePermissions, { eager: true })
  resource: Resource;

  @ManyToOne(() => Action, action => action.rolePermissions, { eager: true })
  action: Action;

  @Column()
  @Index()
  actionName: string; // Store the name of the action
}
