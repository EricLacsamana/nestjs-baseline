import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from 'src/users/user.entity';

import { RolePermission } from './role-permission.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // E.g., 'Super Admin'

  @Column({ unique: true })
  identifier: string; // E.g., 'super-admin'

  @ManyToMany(() => User, (user) => user.roles)
  @JoinTable()
  users: User[];

  @OneToMany(() => RolePermission, (rolePermission) => rolePermission.role)
  rolePermissions: RolePermission[];

  @CreateDateColumn()
  createdAt: Date; // Timestamp when the role was created

  @UpdateDateColumn()
  updatedAt: Date; // Timestamp when the role was last updated
}
