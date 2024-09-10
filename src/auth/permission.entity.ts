import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Role } from './role.entity';
import { Module } from './module.entity';

@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => Role, role => role.resources)
  roles: Role[];

  @ManyToMany(() => Module, module => module.permissions)
  modules: Module[];
}
