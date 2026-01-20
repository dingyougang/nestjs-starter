import {
  DynamicModule,
  Global,
  Module,
  OnApplicationShutdown,
  Provider,
  Type,
} from '@nestjs/common';
import {
  PrismaAsyncModuleOptions,
  PrismaModuleOptions,
  PrismaOptionsFactory,
} from './prisma-options.interface';
// import {  PrismaClient } from '@prisma/client';
import { PrismaClient as MysqlClient } from 'prisma-mysql';
import { getDBType } from './prisma.utils';
import {
  PRISMA_CLIENT_NAME,
  PRISMA_CONNETIONS,
  PRISMA_MODULE_OPTIONS,
} from './prisma.constant';
import { catchError, defer, lastValueFrom } from 'rxjs';
import { handleRetry } from './prisma.utils';
// import { PrismaCommonModule } from './prisma-common.module';

@Module({})
@Global()
export class PrismaCoreModule implements OnApplicationShutdown {
  private static connections: Record<string, any> = {};
  onApplicationShutdown(singal?: string) {
    if (
      PrismaCoreModule.connections &&
      Object.keys(PrismaCoreModule.connections).length > 0
    ) {
      for (const [key, value] of Object.entries(PrismaCoreModule.connections)) {
        console.log('关闭数据源', key);
        if (value && typeof value.$disconnect === 'function') {
          value.$disconnect();
        }
      }
    }
  }
  static forRoot(_options: PrismaModuleOptions): DynamicModule {
    const {
      url,
      options = {},
      name,
      retryAttempts = 10,
      retryDelay = 3000,
      connectionFactory,
      connectionErrorFactory,
    } = _options;
    let newOptions = {
      datasourceUrl: url,
    };
    if (!Object.keys('options'.length)) {
      newOptions = {
        ...newOptions,
        ...options,
      };
    }
    const dbType = getDBType(url);
    let _prismaClient: any;
    if (dbType == 'mysql') {
      _prismaClient = MysqlClient;
    } else if (dbType == 'postgresql') {
      // 其他数据库驱动
    } else {
      throw new Error(`${dbType} is not supported`);
    }
    const providerName = name || PRISMA_CLIENT_NAME;
    const prismaConnectionErrorFactory =
      connectionErrorFactory || ((error) => error);
    const prismaConnectionFactory =
      connectionFactory ||
      (async (clientOptions) => await new _prismaClient(clientOptions));
    const prismaClientProvider: Provider = {
      provide: providerName,
      useFactory: async () => {
        if (PrismaCoreModule.connections[url]) {
          return PrismaCoreModule.connections[url];
        }
        const client = await prismaConnectionFactory(newOptions, _prismaClient);
        PrismaCoreModule.connections[url] = client;
        return lastValueFrom(
          defer(() => client.$connect()).pipe(
            handleRetry(retryAttempts, retryDelay),
            catchError((error) => {
              throw prismaConnectionErrorFactory(error);
            }),
          ),
        ).then(() => client);
      },
    };
    const connetionProvider = {
      provide: PRISMA_CONNETIONS,
      useValue: PrismaCoreModule.connections,
    };
    return {
      module: PrismaCoreModule,
      providers: [prismaClientProvider, connetionProvider],
      exports: [prismaClientProvider, connetionProvider],
    };
  }
  static forRootAsync(_options: PrismaAsyncModuleOptions): DynamicModule {
    const providerName = _options.name || PRISMA_CLIENT_NAME;
    const prismaClientProvider: Provider = {
      provide: providerName,
      useFactory: (prismaModuleOptions: PrismaModuleOptions) => {
        if (!prismaModuleOptions) return;
        const {
          url,
          options = {},
          retryAttempts = 10,
          retryDelay = 3000,
          connectionFactory,
          connectionErrorFactory,
        } = prismaModuleOptions;
        let newOptions = {
          datasourceUrl: url,
        };
        if (!Object.keys('options'.length)) {
          newOptions = {
            ...newOptions,
            ...options,
          };
        }
        const dbType = getDBType(url);
        let _prismaClient: any;
        if (dbType == 'mysql') {
          _prismaClient = MysqlClient;
        } else if (dbType == 'postgresql') {
          // 其他数据库驱动
        } else {
          throw new Error(`${dbType} is not supported`);
        }
        const prismaConnectionErrorFactory =
          connectionErrorFactory || ((error) => error);
        const prismaConnectionFactory =
          connectionFactory ||
          (async (clientOptions) => await new _prismaClient(clientOptions));
        return lastValueFrom(
          defer(async () => {
            const url = newOptions.datasourceUrl;
            if (PrismaCoreModule.connections[url]) {
              return PrismaCoreModule.connections[url];
            }
            const client = await prismaConnectionFactory(
              newOptions,
              _prismaClient,
            );
            PrismaCoreModule.connections[url] = client;
            return client;
          }).pipe(
            handleRetry(retryAttempts, retryDelay),
            catchError((error) => {
              throw prismaConnectionErrorFactory(error);
            }),
          ),
        );
      },
      inject: [PRISMA_MODULE_OPTIONS],
    };
    const asyncProviders = this.createAsyncProviders(_options);
    const connetionProvider = {
      provide: PRISMA_CONNETIONS,
      useValue: PrismaCoreModule.connections,
    };
    return {
      module: PrismaCoreModule,
      exports: [prismaClientProvider, connetionProvider],
      providers: [...asyncProviders, prismaClientProvider, connetionProvider],
    };
  }
  private static createAsyncProviders(options: PrismaAsyncModuleOptions) {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }

    const useClass = options.useClass as Type<PrismaOptionsFactory>;
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: useClass,
        useClass,
      },
    ];
  }
  private static createAsyncOptionsProvider(
    options: PrismaAsyncModuleOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: PRISMA_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    const inject = [
      (options.useClass || options.useExisting) as Type<PrismaOptionsFactory>,
    ];
    return {
      provide: PRISMA_MODULE_OPTIONS,
      inject,
      useFactory: async (optionsFactory: PrismaOptionsFactory) =>
        optionsFactory.createPrismaOptions(),
    };
  }
}
