// src/auth/resource.entity.ts
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Role } from '../../roles/entities/role.entity';
import { RolePermission } from '../../roles/entities/role-permission.entity';
import { Action } from './action.entity';

@Entity()
export class Resource {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string; // E.g., 'Task', 'Note'

  @OneToMany(() => Action, (action) => action.id)
  actions: Action[];
}
