import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { UserTenant } from 'src/users/user-tenant.entity';

@Entity('tenants')
export class Tenant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @IsNotEmpty()
  name: string; // Name of the tenant

  @Column({ unique: true })
  @IsNotEmpty()
  subdomain: string; // Subdomain for the tenant

  @Column()
  @IsEmail()
  email: string; // Email of the tenant owner

  @Column({ nullable: true })
  @IsOptional()
  logoUrl: string; // Optional logo URL for branding

  @Column({ default: true })
  isActive: boolean; // Status to check if the tenant is active

  @CreateDateColumn()
  createdAt: Date; // Timestamp when the tenant was created

  @UpdateDateColumn()
  updatedAt: Date; // Timestamp when the tenant was last updated

  @OneToMany(() => UserTenant, (userTenant) => userTenant.tenant, {
    cascade: true,
  })
  userTenants: UserTenant[];
}
