import { Inject, OnApplicationShutdown } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TYPEORM_CONNECTION } from './typeorm.constants';

export class TypeormProvider implements OnApplicationShutdown {
  constructor(
    @Inject(TYPEORM_CONNECTION)
    private readonly connection: Map<string, DataSource>,
  ) {}
  onApplicationShutdown(signal?: string) {
    console.log('AppService.onApplicationShutdown', signal);
    if (this.connection.size > 0) {
      this.connection.forEach((dataSource, key) => {
        dataSource.destroy();
        console.log('🚀 ~ AppService ~ onApplicationShutdown ~ key:', key);
      });
    }
  }
}
