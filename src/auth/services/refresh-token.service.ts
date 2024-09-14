import {
  forwardRef,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { User } from 'src/users/user.entity';
import { parseDuration } from 'src/utils/durationParser';

import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { RefreshToken } from '../entities/refresh-token.entity';
import { AuthService } from './auth.service';

@Injectable()
export class RefreshTokenService {
  private readonly logger = new Logger(RefreshTokenService.name);

  private readonly refreshTokenExpiresIn = parseDuration(
    process.env.REFRESH_TOKEN_EXPIRES_IN,
  );

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokensRepository: Repository<RefreshToken>,
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  async createRefreshToken(
    user: User,
    deviceId?: string,
    deviceName?: string,
    location?: string,
  ): Promise<string> {
    const refreshToken = this.jwtService.sign(
      { sub: user.id, jti: uuidv4() },
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN },
    );

    const expiresAt = new Date(Date.now() + this.refreshTokenExpiresIn);

    const refreshTokenEntity = this.refreshTokensRepository.create({
      token: refreshToken,
      user,
      expiresAt,
      deviceId,
      deviceName,
      location,
    });

    await this.refreshTokensRepository.save(refreshTokenEntity);
    return refreshToken;
  }

  async refreshTokens(
    oldRefreshTokenDto: RefreshTokenDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { refreshToken, deviceId } = oldRefreshTokenDto;

    // Validate input
    if (!refreshToken) {
      throw new UnauthorizedException('Token is missing');
    }

    // Validate and decode the old refresh token
    const decoded = await this.validateRefreshToken(refreshToken, deviceId);
    const userId = decoded?.sub;

    if (!userId) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    this.logger.log(`Decoded user ID from token: ${userId}`);

    // Fetch user from repository
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Revoke the old refresh token for this device (if deviceId is provided)
    await this.revokeRefreshToken(refreshToken, deviceId);

    // Generate new tokens
    const newAccessToken = await this.authService.generateAccessToken(user);
    const newRefreshToken = await this.createRefreshToken(user, deviceId);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async validateRefreshToken(token: string, deviceId?: string): Promise<any> {
    const query: any = { token, revoked: false };
    if (deviceId) {
      query.deviceId = deviceId;
    }

    const refreshToken = await this.refreshTokensRepository.findOne({
      where: query,
    });

    if (!refreshToken) {
      throw new UnauthorizedException('Invalid or missing refresh token');
    }

    // Verify the token using JWT service
    const decoded = this.jwtService.verify(token, {
      secret: process.env.JWT_REFRESH_SECRET,
    });

    // Additional checks if deviceId is provided
    if (deviceId && decoded.deviceId !== deviceId) {
      throw new UnauthorizedException('Token does not match the device ID');
    }

    return decoded;
  }

  async revokeRefreshToken(token: string, deviceId?: string): Promise<void> {
    const query: any = { token };
    if (deviceId) {
      query.deviceId = deviceId;
    }

    const refreshToken = await this.refreshTokensRepository.findOne({
      where: query,
    });

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    // Mark the token as revoked
    refreshToken.revoked = true;
    await this.refreshTokensRepository.save(refreshToken);
  }
}
