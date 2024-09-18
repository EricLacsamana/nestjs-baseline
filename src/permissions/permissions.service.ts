import { Injectable } from '@nestjs/common';
import { RequestMethod } from '@nestjs/common';
import { METHOD_METADATA, PATH_METADATA } from '@nestjs/common/constants';
import { ConfigService } from '@nestjs/config';
import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import { join } from 'path';

@Injectable()
export class PermissionsService {
  private permissions = new Map<
    string,
    {
      method: string;
      action: string;
      endpoint: string;
      fullUrl: string;
      resource: string;
      handler: string;
    }[]
  >(); // In-memory store for permissions

  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly metadataScanner: MetadataScanner,
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
  ) {}

  async generateDynamicPermissions() {
    this.permissions.clear(); // Clear existing permissions

    const controllers = this.discoveryService.getControllers();
    console.log('Controllers:', controllers); // Debugging

    for (const controller of controllers) {
      const instance = controller.instance;
      const prototype = Object.getPrototypeOf(instance);

      // Get all methods from the prototype
      const methodNames = this.metadataScanner.getAllMethodNames(prototype);
      console.log('Method Names:', methodNames); // Debugging

      for (const methodName of methodNames) {
        const method = prototype[methodName];
        const permissions = this.reflector.get<{ action: string }[]>(
          'permissions',
          method,
        );

        if (permissions) {
          const routeMetadata = this.getRouteMetadata(prototype, methodName);
          const resourceName = controller.instance.constructor.name.replace(
            /Controller$/,
            '',
          );
          const handler = this.getHandlerFilePath(
            controller.instance.constructor.name,
            methodName,
          );
          const baseUrl = this.configService.get<string>('API_URL', 'API_URL');

          // Ensure the endpoint starts with a '/'
          const endpoint = routeMetadata.path.startsWith('/')
            ? routeMetadata.path
            : `/${routeMetadata.path}`;

          // Ensure there is a '/' between baseUrl and endpoint
          const fullUrl = `${baseUrl.replace(/\/$/, '')}${endpoint}`;

          if (!this.permissions.has(endpoint)) {
            this.permissions.set(endpoint, []);
          }

          for (const perm of permissions) {
            const action = perm.action;
            if (
              typeof action === 'string' &&
              !this.permissions.get(endpoint).find((p) => p.action === action)
            ) {
              this.permissions.get(endpoint).push({
                method: routeMetadata.method,
                action,
                endpoint,
                fullUrl,
                resource: resourceName,
                handler,
              });
            }
          }
        }
      }
    }

    return {
      message: 'Dynamic permissions generated successfully',
      permissions: Array.from(this.permissions.entries()).map(
        ([path, perms]) => ({
          route: path,
          permissions: perms.map((perm) => ({
            method: perm.method,
            action: perm.action,
            endpoint: perm.endpoint,
            fullUrl: perm.fullUrl,
            handler: perm.handler,
            resource: perm.resource,
          })),
        }),
      ),
    };
  }

  private getRouteMetadata(
    prototype: any,
    methodName: string,
  ): { path: string; method: string } {
    const controllerPath =
      this.reflector.get<string>(PATH_METADATA, prototype.constructor) || '';
    const methodPath =
      this.reflector.get<string>(PATH_METADATA, prototype[methodName]) || '';

    // Construct the full path
    const path = join(controllerPath, methodPath).replace(/\/{2,}/g, '/'); // Normalize path

    // Ensure the path starts with a '/'
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;

    // Get the HTTP method from metadata
    const method = this.reflector.get<RequestMethod>(
      METHOD_METADATA,
      prototype[methodName],
    );

    return {
      path: normalizedPath || 'unknown',
      method: RequestMethod[method],
    };
  }

  private getHandlerFilePath(
    controllerName: string,
    methodName: string,
  ): string {
    // Generate the file path based on controller and method names
    return `./${controllerName}/${methodName}`; // Placeholder, adjust if needed
  }

  getPermissions() {
    return Array.from(this.permissions.entries()).map(([path, perms]) => ({
      route: path,
      permissions: perms.map((perm) => ({
        method: perm.method,
        action: perm.action,
        endpoint: perm.endpoint,
        fullUrl: perm.fullUrl,
        handler: perm.handler,
        resource: perm.resource,
      })),
    }));
  }
}
