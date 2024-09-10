import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Logger,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('register')
  async register(@Body() body: RegisterDto) {
    this.logger.log('Registering user');
    try {
      const user = await this.authService.register(body);
      return { user };
    } catch (error) {
      this.logger.error('Registration failed', error.stack);
      throw new HttpException(
        'Failed to register user',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    this.logger.log(`Logging in user: ${body.username}`);

    try {
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
    } catch (error) {
      this.logger.error('Login failed', error.stack);

      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new HttpException(
        'Failed to login',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
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
    @Body() refreshTokenDto,
  ): Promise<{ accessToken: string }> {
    try {
      return await this.authService.refreshTokens(refreshTokenDto);
    } catch (error) {
      this.logger.error('Failed to refresh tokens', error.stack);
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }
}
