// module-discovery.types.ts

export interface MethodInfo {
  method: string;
  action: string;
  handler: string;
  fullUrl: string;
}

export interface Route {
  route: string;
  methods: MethodInfo[];
}

export interface ControllerModule {
  controller: string;
  routes: Route[];
}

export interface DiscoverModulesResponse {
  message: string;
  baseUrl: string;
  modules: {
    module: string;
    controllers: ControllerModule[];
  }[];
}

export interface GetModulesResponse {
  modules: {
    module: string;
    controllers: ControllerModule[];
  }[];
}
