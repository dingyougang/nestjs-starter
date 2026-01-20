import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './typeorm-config.service';
import { DataSource } from 'typeorm';
// import { User } from '@/user/entities/user.entity';
import { TYPEORM_DATABASE } from '../database.constants';
import { TypeormProvider } from './typeorm.provider';
import { TYPEORM_CONNECTION } from './typeorm.constants';
// import { UserTypeormRepository } from '@/user/repositories/typeorm.repositor';
const connections = new Map();
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      name: TYPEORM_DATABASE,
      inject: [],
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options) => {
        const tenantId = options['tenantId'] || 'default';
        if (tenantId && connections.has(tenantId)) {
          console.log('使用缓存数据源');
          return connections.get(tenantId);
        }
        const dataSource = await new DataSource(options).initialize();
        connections.set(tenantId, dataSource);
        return dataSource;
      },
      extraProviders: [],
    }),
  ],
  providers: [
    TypeormProvider,
    {
      provide: TYPEORM_CONNECTION,
      useValue: connections,
    },
  ],
  exports: [
    // UserTypeormRepository
  ],
})
export class TypeormCommonModule {}
