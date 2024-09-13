import { User } from 'src/users/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToMany,
  JoinTable,
} from 'typeorm';
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
  @JoinTable()
  rolePermissions: RolePermission[];
}
