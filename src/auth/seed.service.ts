import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './role.entity';
import { Action } from './action.entity';
import { User } from '../users/user.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Action)
    private readonly actionRepository: Repository<Action>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async onModuleInit() {
    await this.seed();
  }

  private loadSeedData(fileName: string) {
    const filePath = path.join(__dirname, '../seed-data', fileName);
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  }

  async seed() {
    // Load seed data
    const rolesData = this.loadSeedData('roles.json');
    const actionsData = this.loadSeedData('actions.json');
    const usersData = this.loadSeedData('users.json');

    // Seed Roles
    const roles = await this.roleRepository.save(rolesData);

    // Seed Actions
    await this.actionRepository.save(actionsData);

    // Seed Users
    for (const userData of usersData) {
      const rolesForUser = roles.filter(role => userData.roles.includes(role.identifier));
      await this.userRepository.save({
        ...userData,
        roles: rolesForUser
      });
    }

    console.log('Roles, Actions, and Users seeding completed.');
  }
}
