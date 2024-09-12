import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Role } from './role.entity';
import { Resource } from './resource.entity';

@Entity()
export class RolePermission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  roleId: number;

  @Column()
  resourceId: number;

  // @ManyToOne(() => Role, role => role.rolePermissions)
  // role: Role;

  @ManyToOne(() => Resource)
  resource: Resource;
}
