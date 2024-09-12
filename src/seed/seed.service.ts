import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/user.entity';
import { Role } from 'src/auth/entities/role.entity';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async seed() {
    // Check if seeding is needed by verifying if roles and users exist
    const rolesExist = await this.roleRepository.count() > 0;
    const usersExist = await this.userRepository.count() > 0;

    if (rolesExist && usersExist) {
      this.logger.log('Database already seeded. Skipping seeding.');
      return;
    }

    // Proceed with seeding only if roles or users do not exist
    if (!rolesExist) {
      await this.seedRoles();
    }
    
    if (!usersExist) {
      await this.seedUsers();
    }

    this.logger.log('Database seeding completed.');
  }

  private async seedRoles() {
    const roles = [
      { name: 'Super Admin', identifier: 'super-admin' },
      { name: 'Admin', identifier: 'admin' },
      { name: 'User', identifier: 'user' },
    ];

    for (const roleData of roles) {
      const existingRole = await this.roleRepository.findOne({ where: { identifier: roleData.identifier } });
      if (!existingRole) {
        const role = this.roleRepository.create(roleData);
        await this.roleRepository.save(role);
        this.logger.log(`Role "${roleData.name}" inserted.`);
      } else {
        this.logger.log(`Role "${roleData.name}" already exists.`);
      }
    }
  }

  private async seedUsers() {
    const roles = await this.roleRepository.find();
    const users = [
      {
        username: 'johndoe',
        email: 'johndoe@example.com',
        password: 'password123', // This will be hashed
        name: 'John Doe',
        roles: ['admin', 'user'],
        // sub: 12345,
      },
      {
        username: 'janedoe',
        email: 'janedoe@example.com',
        password: 'password456', // This will be hashed
        name: 'Jane Doe',
        roles: ['user'],
        // sub: 67890,
      },
    ];

    for (const userData of users) {
      const existingUser = await this.userRepository.findOne({ where: { username: userData.username } });
      if (!existingUser) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const userRoles = roles.filter(role => userData.roles.includes(role.identifier));
        const user = this.userRepository.create({
          ...userData,
          password: hashedPassword,
          roles: userRoles,
        });
        await this.userRepository.save(user);
        this.logger.log(`User "${userData.username}" inserted.`);
      } else {
        this.logger.log(`User "${userData.username}" already exists.`);
      }
    }
  }
}
