import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionsService } from './permissions.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly permissionsService: PermissionsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user.id;
    const resourceName = this.reflector.get<string>('resource', context.getHandler());
    const actionName = this.reflector.get<string>('action', context.getHandler());

    if (!resourceName || !actionName) {
      throw new ForbiddenException('Resource or action not defined');
    }

    const hasPermission = await this.permissionsService.hasPermission(userId, resourceName, actionName);
    if (!hasPermission) {
      throw new ForbiddenException('Access denied');
    }

    return true;
  }
}
