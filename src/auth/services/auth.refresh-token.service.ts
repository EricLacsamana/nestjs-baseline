import {
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import { RefreshToken } from '../entities/refresh-token.entity';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { parseDurationInMs } from 'src/utils/durationInMsParser';

@Injectable()
export class RefreshTokenService {
  private readonly logger = new Logger(RefreshTokenService.name);

  private readonly refreshTokenExpiresInMs = parseDurationInMs(
    parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN_DAYS || '7', 10),
  );

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokensRepository: Repository<RefreshToken>,
    private readonly jwtService: JwtService,
  ) {}

  async createRefreshToken(user: User): Promise<string> {
    try {
      const refreshToken = this.jwtService.sign(
        { sub: user.id },
        { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' },
      );

      const expiresAt = new Date(Date.now() + this.refreshTokenExpiresInMs);

      const refreshTokenEntity = this.refreshTokensRepository.create({
        token: refreshToken,
        user,
        expiresAt,
      });

      await this.refreshTokensRepository.save(refreshTokenEntity);
      return refreshToken;
    } catch (error) {
      this.logger.error('Failed to create refresh token', error.stack);
      throw new InternalServerErrorException('Failed to create refresh token');
    }
  }

  async refreshTokens(refreshTokenDto: RefreshTokenDto): Promise<string> {
    try {
      const { refreshToken } = refreshTokenDto;
      const token = await this.refreshTokensRepository.findOne({
        where: { token: refreshToken },
        relations: ['user'],
      });

      if (!token || token.expiresAt < new Date()) {
        throw new UnauthorizedException('Invalid or expired refresh token');
      }

      const user = token.user;
      await this.refreshTokensRepository.delete(token.id);

      return this.generateAccessToken(user);
    } catch (error) {
      this.logger.error('Failed to refresh tokens', error.stack);
      throw new UnauthorizedException('Failed to refresh tokens');
    }
  }

  async generateAccessToken(user: User): Promise<string> {
    try {
      return this.jwtService.sign(
        {
          sub: user.id,
        },
        {
          expiresIn: process.env.JWT_EXPIRES_IN || '1h',
        },
      );
    } catch (error) {
      this.logger.error('Failed to generate access token', error.stack);
      throw new InternalServerErrorException('Failed to generate access token');
    }
  }
}
