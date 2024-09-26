import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Tenant } from 'src/tenant/tenant.entity';

import { User } from '../users/user.entity';

@Entity()
export class UserTenant {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.userTenants, { eager: true })
  user: User;

  @ManyToOne(() => Tenant, (tenant) => tenant.userTenants, { eager: true })
  tenant: Tenant;

  @Column()
  role: string; // Optional: role in the tenant (e.g., admin, member)

  @Column({ default: true })
  isActive: boolean; // To indicate if the user is still a member of the tenant

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  invitedAt: Date; // When the user was invited

  @Column({ nullable: true })
  acceptedAt: Date; // When the user accepted the invitation (if applicable)
}
