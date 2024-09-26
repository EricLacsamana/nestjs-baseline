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

import { Role } from 'src/roles/entities/role.entity';
import { Tenant } from 'src/tenant/tenant.entity';

import { RefreshToken } from '../auth/entities/refresh-token.entity';
import { UserTenant } from './user-tenant.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable()
  roles: Role[];

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshTokens: RefreshToken[];

  // @ManyToMany(() => Tenant, (tenant) => tenant.users)
  // @JoinTable()
  // tenants: Tenant[];

  @OneToMany(() => UserTenant, (userTenant) => userTenant.user)
  userTenants: UserTenant[];

  @CreateDateColumn()
  createdAt: Date; // Timestamp when the user was created

  @UpdateDateColumn()
  updatedAt: Date; // Timestamp when the user was last updated

  @Column({ default: true })
  isActive: boolean; // Status to check if the user is active
}
