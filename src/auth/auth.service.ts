import {
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpService } from '@nestjs/axios';
import * as bcrypt from 'bcrypt';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../users/user.entity';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import { RefreshToken } from './refresh-token.entity';
import { parseDuration } from 'src/utils/timeParser';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  private readonly accessTokenExpiresInMs = parseDuration(
    process.env.JWT_EXPIRES_IN || '15m',
  );
  private readonly refreshTokenExpiresInMs = parseDuration(
    process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  );

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
  ) {
    this.logger.log('AuthService initialized');
  }

  getUserPermissions(): Observable<string[]> {
    return this.httpService
      .get<string[]>('/api/permissions')
      .pipe(map(response => response.data));
  }

  async register(registerDto: RegisterDto): Promise<User> {
    try {
      const { username, email, password, name } = registerDto;
      const hashedPassword = await bcrypt.hash(password, 10);
      return await this.usersService.create({
        username,
        email,
        password: hashedPassword,
        name,
      });
    } catch (error) {
      this.logger.error('Registration failed', error.stack);
      throw new InternalServerErrorException('Failed to register user');
    }
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
      const payload = { username: user.username, sub: user.id };
      const accessToken = this.jwtService.sign(payload, {
        expiresIn: this.accessTokenExpiresInMs / 1000,
      });
      const refreshToken = await this.generateRefreshToken(user);
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

  async generateRefreshToken(user: User): Promise<string> {
    try {
      const refreshToken = this.jwtService.sign(
        { sub: user.id },
        {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: this.refreshTokenExpiresInMs / 1000,
        },
      );

      await this.refreshTokenRepository.save({
        token: refreshToken,
        user: user,
        expiresAt: new Date(Date.now() + this.refreshTokenExpiresInMs),
      });

      return refreshToken;
    } catch (error) {
      this.logger.error('Refresh token generation failed', error.stack);
      throw new InternalServerErrorException(
        'Failed to generate refresh token',
      );
    }
  }

  async refreshTokens(oldRefreshToken: string) {
    try {
      if (!oldRefreshToken) {
        throw new UnauthorizedException('Refresh token is missing');
      }

      const decoded = this.jwtService.verify(oldRefreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
      const userId = decoded.sub;

      if (!userId) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      this.logger.log(`Decoded user ID from token: ${userId}`);

      const user = await this.usersService.findOneById(userId);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const existingToken = await this.refreshTokenRepository.findOne({
        where: { token: oldRefreshToken, user: user },
      });
      if (!existingToken) {
        throw new UnauthorizedException('Invalid or expired refresh token');
      }

      const newAccessToken = this.jwtService.sign(
        {
          username: user.username,
          sub: user.id,
        },
        { expiresIn: this.accessTokenExpiresInMs / 1000 },
      );

      const newRefreshToken = await this.generateRefreshToken(user);

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      this.logger.error('Refresh tokens failed', error.stack);
      throw new UnauthorizedException('Failed to refresh tokens');
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
