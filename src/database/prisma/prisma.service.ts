import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import {
  PrismaModuleOptions,
  PrismaOptionsFactory,
} from './prisma-options.interface';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class PrismaConfigService implements OnModuleInit, PrismaOptionsFactory {
  constructor(
    @Inject(REQUEST)
    private request: Request,
  ) {}
  createPrismaOptions(): Promise<PrismaModuleOptions> | PrismaModuleOptions {
    const headers = this.request.headers;
    const tenantId = headers['x-tenant-id'] || 'default';

    if (tenantId == 'mysql1') {
      console.log('PrismaModule=====>', tenantId == 'mysql1');
      return {
        url: 'mysql://root:123456@localhost:3306/test1',
      };
    }
    // if (tenantId == 'default') {
    //   return {
    //     url: 'mysql://root:123456@localhost:3306/test1',
    //   };
    // } else if (tenantId == 'mysql2') {
    //   return {
    //     url: 'mysql://root:123456@localhost:3306/test2',
    //   };
    // }
  }
  async onModuleInit() {}
}
