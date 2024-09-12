import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthModule } from 'src/auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'src/auth/entities/role.entity';
import { RolesService } from 'src/auth/services/roles.service';


@Module({
  imports: [forwardRef(() => AuthModule), TypeOrmModule.forFeature([User, Role])],
  providers: [UsersService, JwtService, RolesService],
  controllers: [UsersController],
  exports: [UsersService, RolesService],
})
export class UsersModule {}
