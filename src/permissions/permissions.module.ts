import { Module } from '@nestjs/common';

import { PermissionsController } from './permissions.controller';
import { PermissionsService } from './permissions.service';

@Module({
  providers: [PermissionsService],
  controllers: [PermissionsController],
})
export class PermissionsModule {}
