import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from 'src/users/user.entity';

import { UsersModule } from '../users/users.module';
import { AuthController } from './controllers/auth.controller';
import { RefreshToken } from './entities/refresh-token.entity';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './services/jwt.strategy';
import { RefreshTokenService } from './services/refresh-token.service';
import { GoogleOAuth2Strategy } from './strategies/google-oauth2.strategy';

@Module({
  imports: [
    HttpModule,
    forwardRef(() => UsersModule),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN'),
        },
      }),
    }),
    TypeOrmModule.forFeature([User, RefreshToken]),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    // Usage: GoogleOAuth2Strategy if credentials are provided
    {
      provide: 'GOOGLE_OAUTH2_STRATEGY',
      useFactory: (configService: ConfigService) => {
        const googleClientId = configService.get<string>('GOOGLE_CLIENT_ID');
        const googleClientSecret = configService.get<string>(
          'GOOGLE_CLIENT_SECRET',
        );
        if (googleClientId && googleClientSecret) {
          return new GoogleOAuth2Strategy(configService);
        }
        return null; // todo: handle if no credentials provided
      },
      inject: [ConfigService],
    },
    RefreshTokenService,
  ],
  controllers: [AuthController],
  exports: [AuthService, RefreshTokenService],
})
export class AuthModule {}
