import { DynamicModule, Module, Provider } from "@nestjs/common";
import { Auth0Service } from "./services/auth0.service";
import { AUTH0_INJECTOR } from "./constants/injectors.constant";
import { Auth0ModuleOptions } from "./interfaces/auth0-options.interface";
import { HttpModule } from "@nestjs/axios";

export interface Auth0ModuleAsyncOptions {
  useFactory: (
    ...args: any[]
  ) => Promise<Auth0ModuleOptions> | Auth0ModuleOptions;
  inject?: any[];
}

@Module({})
export class Auth0Module {
  static forRoot(options: Auth0ModuleOptions): DynamicModule {
    return {
      module: Auth0Module,
      providers: [
        {
          provide: AUTH0_INJECTOR,
          useValue: options,
        },
        Auth0Service,
      ],
      exports: [Auth0Service],
      imports: [HttpModule.register({})],
    };
  }

  static forRootAsync(options: Auth0ModuleAsyncOptions): DynamicModule {
    const asyncProvider: Provider = {
      provide: AUTH0_INJECTOR,
      useFactory: options.useFactory,
      inject: options.inject || [],
    };

    return {
      module: Auth0Module,
      providers: [asyncProvider, Auth0Service],
      exports: [Auth0Service],
      imports: [HttpModule.register({})],
    };
  }
}
