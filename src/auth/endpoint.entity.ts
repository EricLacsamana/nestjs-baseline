// src/auth/endpoint.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Endpoint {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  path: string; // E.g., '/api/users', '/api/products'
}
