import { Injectable } from '@nestjs/common';
import { RequestMethod } from '@nestjs/common';
import { METHOD_METADATA, PATH_METADATA } from '@nestjs/common/constants';
import { ConfigService } from '@nestjs/config';
import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import { join } from 'path';

interface Route {
  route: string;
  methods: {
    method: string;
    action: string;
    handler: string;
    fullUrl: string;
  }[];
}

interface ControllerModule {
  controller: string;
  routes: Route[];
}

export interface ModuleData {
  controllers: ControllerModule[];
}

@Injectable()
export class ModuleDiscoveryService {
  private modules = new Map<string, ModuleData>();

  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly metadataScanner: MetadataScanner,
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
  ) {}

  async discoverModules() {
    this.modules.clear();
    const controllers = this.discoveryService.getControllers();

    for (const controller of controllers) {
      await this.processController(controller);
    }

    return this.formatResponse();
  }

  private async processController(controller: any) {
    const controllerName = controller.instance.constructor.name; // Full controller name
    const moduleName = this.getResourceName(controllerName); // Get the module name based on your logic
    const controllerRoutes: Route[] = [];

    const methodNames = this.metadataScanner.getAllMethodNames(
      Object.getPrototypeOf(controller.instance),
    );

    for (const methodName of methodNames) {
      await this.processMethod(controller, methodName, controllerRoutes);
    }

    // Store the exact module name along with the full controller name
    const existingModule = this.modules.get(moduleName) || { controllers: [] };

    // Add the controller to the existing module's controllers array
    existingModule.controllers.push({
      controller: controllerName,
      routes: controllerRoutes,
    });

    this.modules.set(moduleName, existingModule);
  }

  private async processMethod(
    controller: any,
    methodName: string,
    controllerRoutes: Route[],
  ) {
    const method = controller.instance[methodName];
    const action = this.reflector.get<string>('action', method);

    const { path, method: httpMethod } = this.getRouteMetadata(
      controller,
      methodName,
    );
    const handler = this.getHandlerFilePath(
      controller.instance.constructor.name,
      methodName,
    );
    const fullUrl = this.constructFullUrl(path);
    const routeEntry = this.findOrCreateRoute(controllerRoutes, path);

    console.log('Route entry:', routeEntry); // Log route entry for debugging

    this.addMethodToRoute(routeEntry, {
      httpMethod,
      action,
      handler,
      fullUrl,
    });
  }

  private getRouteMetadata(
    controller: any,
    methodName: string,
  ): { path: string; method: string } {
    const prototype = Object.getPrototypeOf(controller.instance);
    const controllerPath =
      this.reflector.get<string>(PATH_METADATA, prototype.constructor) || '';
    const methodPath =
      this.reflector.get<string>(PATH_METADATA, prototype[methodName]) || '';
    const path = join(controllerPath, methodPath).replace(/\/{2,}/g, '/');
    const method = this.reflector.get<RequestMethod>(
      METHOD_METADATA,
      prototype[methodName],
    );

    return {
      path: this.normalizeEndpoint(path) || 'unknown',
      method: RequestMethod[method],
    };
  }

  private normalizeEndpoint(path: string): string {
    return path.startsWith('/') ? path : `/${path}`;
  }

  private getResourceName(controllerName: string): string {
    return controllerName.replace(/Controller$/, '');
  }

  private getHandlerFilePath(
    controllerName: string,
    methodName: string,
  ): string {
    return `./${controllerName}/${methodName}`; // Adjust as needed
  }

  private constructFullUrl(path: string): string {
    const baseUrl = this.configService.get<string>(
      'API_URL',
      'http://localhost:4000',
    );
    return `${baseUrl.replace(/\/$/, '')}${this.normalizeEndpoint(path)}`;
  }

  private findOrCreateRoute(controllerRoutes: Route[], path: string): Route {
    const existingRoute = controllerRoutes.find((r) => r.route === path);

    if (existingRoute) {
      return existingRoute; // Return the existing route
    } else {
      const newRoute: Route = { route: path, methods: [] };
      controllerRoutes.push(newRoute); // Ensure you add the new route to the array
      return newRoute;
    }
  }

  private addMethodToRoute(
    route: Route,
    methodDetails: {
      httpMethod: string;
      action: string;
      handler: string;
      fullUrl: string;
    },
  ) {
    if (!route.methods.some((m) => m.action === methodDetails.action)) {
      route.methods.push({
        method: methodDetails.httpMethod,
        action: methodDetails.action,
        handler: methodDetails.handler,
        fullUrl: methodDetails.fullUrl,
      });
    }
  }

  private formatResponse() {
    return {
      message: 'Modules discovered successfully',
      baseUrl: this.configService.get<string>('API_URL'),
      modules: Array.from(this.modules.entries()).map(
        ([moduleName, moduleData]) => ({
          module: moduleName,
          controllers: moduleData.controllers,
        }),
      ),
    };
  }

  getModules() {
    return {
      modules: Array.from(this.modules.entries()).map(
        ([moduleName, moduleData]) => ({
          module: moduleName,
          controllers: moduleData.controllers,
        }),
      ),
    };
  }
}
