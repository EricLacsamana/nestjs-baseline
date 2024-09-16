import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AuthenticationMiddleware } from './common/middleware/authentication.middleware';
import { DynamicQueryBuilderMiddleware } from './common/middleware/dynamic-query-builder.middleware';
import { QueryParsingService } from './common/services/query-parsing.service';
import { RequestContextService } from './request-context/request-context.service';
import { Role } from './roles/entities/role.entity';
import { RolePermission } from './roles/entities/role-permission.entity';
import { RolesModule } from './roles/roles.module';
import { SeedService } from './seed/seed.service';
import { User } from './users/user.entity';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: process.env.DATABASE_TYPE as
        | 'postgres'
        | 'mysql'
        | 'mariadb'
        | 'sqlite'
        | 'mssql'
        | 'mongodb',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT, 10),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      // entities: [Role, User],
      autoLoadEntities: true,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, Role, RolePermission]),
    AuthModule,
    UsersModule,
    RolesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    SeedService,
    QueryParsingService,
    RequestContextService,
  ],
})
export class AppModule {
  constructor(private readonly seedService: SeedService) {
    this.seedService.seed();
  }
  configure(consumer: MiddlewareConsumer) {
    // Apply AuthenticationMiddleware to POST requests
    // consumer
    //   .apply(QueryParsingMiddleware, AuthenticationMiddleware)
    //   .forRoutes({ path: '*', method: RequestMethod.POST });

    consumer
      .apply(DynamicQueryBuilderMiddleware) // Apply multiple middleware
      .forRoutes({ path: '*', method: RequestMethod.GET }); // Apply only to GET requests
  }
}
