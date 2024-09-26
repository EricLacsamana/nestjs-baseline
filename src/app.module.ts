import {
  MiddlewareConsumer,
  Module,
  OnModuleInit,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AuthenticationMiddleware } from './common/middleware/authentication.middleware';
import { DynamicQueryBuilderMiddleware } from './common/middleware/dynamic-query-builder.middleware';
import { RelationMiddleware } from './common/middleware/relation.middleware';
import { TenantMiddleware } from './common/middleware/tenant.middleware';
import { QueryParsingService } from './common/services/query-parsing.service';
import { env } from './config/config.sevice';
import { ModuleDiscoveryModule } from './module-discovery/module-discovery.module';
import { ModuleDiscoveryService } from './module-discovery/module-discovery.service';
import { RequestContextService } from './request-context/request-context.service';
import { Role } from './roles/entities/role.entity';
import { RolePermission } from './roles/entities/role-permission.entity';
import { RolesModule } from './roles/roles.module';
import { SeedService } from './seed/seed.service';
import { Tenant } from './tenant/tenant.entity';
import { TenantModule } from './tenant/tenant.module';
import { User } from './users/user.entity';
import { UserTenant } from './users/user-tenant.entity';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => env],
      // envFilePath: '.env',
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
    TypeOrmModule.forFeature([User, Role, RolePermission, Tenant, UserTenant]),
    AuthModule,
    UsersModule,
    RolesModule,
    ModuleDiscoveryModule,
    TenantModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    SeedService,
    QueryParsingService,
    RequestContextService,
  ],
})
export class AppModule implements OnModuleInit {
  constructor(
    private readonly moduleDiscoveryService: ModuleDiscoveryService,
    private readonly seedService: SeedService,
  ) {}

  async onModuleInit() {
    await this.seedService.seed(); // Ensure seeding logic is executed only once
    await this.moduleDiscoveryService.discoverModules();
  }

  configure(consumer: MiddlewareConsumer) {
    // Apply AuthenticationMiddleware to POST requests
    consumer.apply(TenantMiddleware).forRoutes('*'); // Apply to all routes, or specify routes if necessary

    consumer
      .apply(RelationMiddleware) // Apply multiple middleware
      .forRoutes({ path: '*', method: RequestMethod.GET }); // Apply only to GET requests
  }
}
