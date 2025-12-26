import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { REQUEST } from '@nestjs/core';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Request } from 'express';

export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(
    @Inject(REQUEST)
    private request: Request,
    private readonly configService: ConfigService,
  ) {}
  createTypeOrmOptions(
    connectionName?: string,
  ): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
    const headers = this.request.headers;
    const tenantId = headers['x-tenant-id'];
    let config = {};
    const envConfig = {
      type: this.configService.get('DB_TYPE'),
      host: this.configService.get('DB_HOST'),
      port: this.configService.get('DB_PORT'),
      username: this.configService.get('DB_USERNAME'),
      password: this.configService.get('DB_PASSWORD'),
      autoLoadEntities: Boolean(this.configService.get('DB_AUTOLOAD', false)),
      synchronize: Boolean(this.configService.get('DB_SYNC', false)),
    };
    if (tenantId == 'mysql1') {
      config = {
        type: 'mysql',
        database: 'test2',
      };
    } else {
      config = {
        type: 'mysql',
        database: 'test1',
      };
    }

    const finallyConfig = {
      ...envConfig,
      ...config,
      // 额外的参数 tenantId
      tenantId,
    };
    return finallyConfig;
  }
}
