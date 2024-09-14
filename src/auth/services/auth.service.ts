import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { UsersService } from 'src/users/users.service';

import { User } from '../../users/user.entity';
import { RegisterDto } from '../dto/register.dto';
import { RefreshToken } from '../entities/refresh-token.entity';
import { RefreshTokenService } from './refresh-token.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,
    private readonly refreshTokenService: RefreshTokenService,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
  ) {
    this.logger.log('AuthService initialized');
  }

  async generateAccessToken(user) {
    return this.jwtService.sign(
      {
        sub: user.id, // User ID (Subject)
        // iss: process.env.JWT_ISSUER,
        // aud: process.env.JWT_AUDIENCE,
        jti: uuidv4(),
      },
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
    );
  }

  getUserPermissions(): Observable<string[]> {
    return this.httpService
      .get<string[]>('/api/permissions')
      .pipe(map((response) => response.data));
  }

  async register(registerDto: RegisterDto): Promise<User> {
    const { username, email, password, name, roles } = registerDto;

    return await this.usersService.create({
      username,
      email,
      password,
      name,
      roles,
    });
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    try {
      const user = await this.usersService.findOneByUsername(username);
      if (user && (await bcrypt.compare(password, user.password))) {
        return user;
      }
      return null;
    } catch (error) {
      this.logger.error('User validation failed', error.stack);
      throw new InternalServerErrorException('Failed to validate user');
    }
  }

  async login(user: User) {
    try {
      const accessToken = await this.generateAccessToken(user);

      const refreshToken =
        await this.refreshTokenService.createRefreshToken(user);

      return {
        username: user.username,
        email: user.email,
        name: user.name,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      this.logger.error('Login failed', error.stack);
      throw new InternalServerErrorException('Failed to login');
    }
  }

  async logout(refreshToken: string) {
    try {
      await this.refreshTokenRepository.delete({ token: refreshToken });
    } catch (error) {
      this.logger.error('Logout failed', error.stack);
      throw new InternalServerErrorException('Failed to logout');
    }
  }
}
