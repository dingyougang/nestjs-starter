import { ModuleMetadata, Type } from '@nestjs/common';
import { Prisma } from '@prisma/client';
export interface PrismaModuleOptions {
  url?: string;
  options?: Prisma.PrismaClientOptions;
  name?: string;
  retryAttempts?: number;
  retryDelay?: number;
  connectionFactory?: (connention: any, clientClass: any) => any;
  connectionErrorFactory?: (
    error: Prisma.PrismaClientKnownRequestError,
  ) => Prisma.PrismaClientKnownRequestError;
}

export interface PrismaOptionsFactory {
  createPrismaOptions(): Promise<PrismaModuleOptions> | PrismaModuleOptions;
}
// Omit 剔除name属性
export type PrismaModuleFactoryOptions = Omit<PrismaModuleOptions, 'name'>;
// Pick 选取imports属性
export interface PrismaAsyncModuleOptions extends Pick<
  ModuleMetadata,
  'imports'
> {
  name?: string;
  // Type 函数转为class
  useExisting?: Type<PrismaOptionsFactory>;
  useClass?: Type<PrismaOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<PrismaModuleFactoryOptions> | PrismaModuleFactoryOptions;
  inject?: any[];
}
