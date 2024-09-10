import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './interfaces/user-create.interface';
import { UsernameAlreadyExistsException } from 'src/common/exceptions/username-already-exist.exception';
import { EmailAlreadyExistsException } from 'src/common/exceptions/email-already-exist.exception';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async getUserProfile(userId: number) {
    return await this.usersRepository.findOne({ where: { id: userId } });
  }

  async create({
    username,
    email,
    password,
    name,
  }: CreateUserDto): Promise<User> {
    let existingUser = await this.findOneByUsername(username);

    if (existingUser) {
      throw new UsernameAlreadyExistsException();
    }

    existingUser = await this.findOneByEmail(email);

    if (existingUser) {
      throw new EmailAlreadyExistsException();
    }

    const user = this.usersRepository.create({
      username,
      email,
      password,
      name,
    });

    return this.usersRepository.save(user);
  }

  async findOneByUsername(username): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async findOneByEmail(email): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findOneById(id: number): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async findAll(): Promise<User[] | undefined> {
    return this.usersRepository.find();
  }
}
