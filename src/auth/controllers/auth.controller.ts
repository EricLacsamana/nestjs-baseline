import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Logger,
  Post,
  UnauthorizedException,
  UseFilters,
} from '@nestjs/common';

import { AuthService } from 'src/auth/services/auth.service';
import { HttpExceptionFilter } from 'src/filters/http-exception.filter';

import { RegisterDto } from '../dto/register.dto';
import { RefreshTokenService } from '../services/refresh-token.service';

@Controller('auth')
@UseFilters(HttpExceptionFilter)
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('register')
  async register(@Body() body: RegisterDto) {
    this.logger.log('Registering user');
    return this.authService.register(body);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    this.logger.log(`Logging in user: ${body.username}`);

    const user = await this.authService.validateUser(
      body.username,
      body.password,
    );

    if (!user) {
      this.logger.warn('Invalid credentials for user: ' + body.username);
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.authService.login(user);
    return tokens;
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(@Body() body: { refreshToken: string }) {
    try {
      await this.authService.logout(body.refreshToken);
      return { message: 'Logged out successfully' };
    } catch (error) {
      this.logger.error('Logout failed', error.stack);
      throw new HttpException(
        'Failed to logout',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refreshTokens(
    @Body() refreshTokenDto: { refreshToken: string },
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return this.refreshTokenService.refreshTokens(refreshTokenDto);
  }
}
