import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './interfaces/user-create.interface';
import { UsernameAlreadyExistsException } from 'src/common/exceptions/username-already-exist.exception';
import { EmailAlreadyExistsException } from 'src/common/exceptions/email-already-exist.exception';
import { Role } from 'src/auth/entities/role.entity';
import { RolesService } from 'src/auth/services/roles.service';
import { RolePermission } from 'src/auth/entities/role-permission.entity';

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
    roles: roleParams, // Expecting role identifiers
  }: CreateUserDto): Promise<User> {
    let existingUser = await this.findOneByUsername(username);

    if (existingUser) {
      throw new UsernameAlreadyExistsException();
    }

    existingUser = await this.findOneByEmail(email);

    if (existingUser) {
      throw new EmailAlreadyExistsException();
    }

    let roles: Role [];

    if (roleParams.length) {
      
      roles = await Promise.all(roleParams.map((roleParam)=> this.rolesService.getRoleWithPermissions(roleParam)))

      if (roles.length !== roleParams.length) {
        throw new NotFoundException('One or more roles not found');
      }
    }


    const user = this.usersRepository.create({
      username,
      email,
      password,
      name,
      roles,
    });
    console.log('new USER', user);
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
