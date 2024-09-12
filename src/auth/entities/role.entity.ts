import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany, JoinTable } from 'typeorm';
import { User } from '../../users/user.entity';
// import { RolePermission } from './role-permission.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // E.g., 'Super Admin'

  @Column({ unique: true })
  identifier: string; // E.g., 'super-admin'

  @ManyToMany(() => User, user => user.roles)
  @JoinTable() 
  users: User[];

  // @OneToMany(() => RolePermission, rolePermission => rolePermission.id)
  // rolePermissions: RolePermission[];
}
