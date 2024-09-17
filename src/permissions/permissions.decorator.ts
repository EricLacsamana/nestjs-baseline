import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'permissions';

interface PermissionMetadata {
  action: string;
}

export const Permissions = (...permissions: PermissionMetadata[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
