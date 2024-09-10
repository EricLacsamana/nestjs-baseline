import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { Role } from './auth/role.entity';
import { Module as ModuleEntity } from './auth/module.entity';
import { RolePermission } from './auth/role-permission.entity';
import { User } from './users/user.entity';
import { Action } from './auth/action.entity';
import { SeedService } from './auth/seed.service';
import { Permission } from './auth/permission.entity';
import { Resource } from './auth/resource.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: process.env.DATABASE_TYPE as 'postgres' | 'mysql' | 'mariadb' | 'sqlite' | 'mssql' | 'mongodb',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT, 10),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [Role, ModuleEntity, Permission, RolePermission, Resource, Action, User],
      autoLoadEntities: true,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, Role, Action]),
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService, SeedService],
})

export class AppModule {
  constructor(private readonly seedService: SeedService) {
    this.seedService.seed();
  }
}

