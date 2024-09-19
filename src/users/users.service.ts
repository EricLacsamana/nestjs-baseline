import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { EmailAlreadyExistsException } from 'src/common/exceptions/email-already-exist.exception';
import { UsernameAlreadyExistsException } from 'src/common/exceptions/username-already-exist.exception';
import { Role } from 'src/roles/entities/role.entity';
import { RolesService } from 'src/roles/services/roles.service';

import { CreateUserDto } from './interfaces/user-create.interface';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly rolesService: RolesService,
  ) {}

  async getUserProfile(userId: number): Promise<User> {
    return await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['roles'],
    });
  }

  async create({
    username,
    email,
    password,
    name,
    roles: roleParams,
  }: CreateUserDto): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: [{ username: username }, { email: email }],
    });

    if (existingUser) {
      if (username && existingUser.username === username) {
        throw new UsernameAlreadyExistsException();
      }
      if (email && existingUser.email === email) {
        throw new EmailAlreadyExistsException();
      }
    }

    let roles: Role[];

    if (roleParams.length) {
      roles = await Promise.all(
        roleParams.map((roleParam) =>
          this.rolesService.findRole({ param: roleParam }),
        ),
      );

      if (roles.length !== roleParams.length) {
        throw new NotFoundException('One or more roles not found');
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.usersRepository.create({
      username,
      email,
      password: hashedPassword,
      name,
      roles,
    });

    return this.usersRepository.save(user);
  }

  async findOneByUsername(username: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findOneById(id: number): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async findAll(): Promise<User[] | undefined> {
    return this.usersRepository.find();
  }
}
