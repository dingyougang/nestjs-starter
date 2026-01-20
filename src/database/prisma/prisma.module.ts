import { DynamicModule, Module } from '@nestjs/common';
import {
  PrismaAsyncModuleOptions,
  PrismaModuleOptions,
} from './prisma-options.interface';
import { PrismaCoreModule } from './prisma-core.module';

@Module({})
export class PrismaModule {
  // 重载
  static forRoot(options: PrismaModuleOptions): DynamicModule;
  static forRoot(url: string): DynamicModule;
  static forRoot(url: string, name?: string): DynamicModule;
  static forRoot(arg: any, ...args): DynamicModule {
    let _options: PrismaModuleOptions;
    if (args && args.length) {
      _options = { url: arg, name: args[0] };
    } else if (typeof arg === 'string') {
      _options = { url: arg };
    } else {
      _options = arg;
    }
    return {
      module: PrismaModule,
      imports: [PrismaCoreModule.forRoot(_options)],
      exports: [],
    };
  }
  static forRootAsync(options: PrismaAsyncModuleOptions) {
    return {
      imports: [PrismaCoreModule.forRootAsync(options)],
      module: PrismaModule,
    };
  }
}
