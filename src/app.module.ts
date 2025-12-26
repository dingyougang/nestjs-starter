import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from './common/config/config.module';
import { LogsModule } from './common/logger/logs.module';
import { CacheModule } from '@nestjs/cache-manager';
// import { RedisModule } from '@nestjs-modules/ioredis';
// import { ConfigService } from '@nestjs/config';
// cache redis
// import { redisStore } from 'cache-manager-ioredis-yet';
import { createKeyv } from '@keyv/redis';
import { ConfigService } from '@nestjs/config';
import { MailModule } from './common/mail/mail.module';
import { UserModule } from './user/user.module';
import {
  TypeOrmModule,
  //  TypeOrmModuleOptions
} from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { TypeOrmConfigService } from './database/typeorm/typeorm-config.service';
import { DataSource } from 'typeorm';
import { AppService } from './app.service';
// import { PrismaModule } from './database/prisma/prisma.module';

const connections = new Map();
@Module({
  imports: [
    ConfigModule,
    LogsModule,
    // RedisModule.forRoot({
    //   type: 'single',
    //   url: 'redis://localhost:6379',
    //   options: {
    //     password: '123456',
    //   },
    // }),
    // 1.redis 注册
    // RedisModule.forRootAsync({
    //   // 注入ConfigService
    //   inject: [ConfigService],
    //   useFactory: (configService: ConfigService) => {
    //     console.log(
    //       '🚀 ~ AppModule ~ configService:',
    //       configService.get('DB_HOST'),
    //     );
    //     return {
    //       type: 'single',
    //       url: 'redis://localhost:6379',
    //       options: {
    //         password: '123456',
    //       },
    //     };
    //   },
    // }),
    // 使用cache-manager
    // CacheModule.register({
    //   ttl: 10 * 1000,
    // }),
    CacheModule.registerAsync({
      inject: [ConfigService],
      // 1.使用cache-manager-ioredis-yet
      useFactory: async (configService: ConfigService) => {
        // const redisHost = configService.get(REDIS_HOST);
        // const redisPort = configService.get(REDIS_PORT);
        // const ttl = configService.get(CACHE_TTL);
        try {
          const keyvInstance = createKeyv({
            url: 'redis://127.0.0.1:6379',
            options: {
              // password: '123456',
            },
          });
          // 添加连接事件监听
          keyvInstance.on('error', (error) => {
            console.error('Redis connection error:', error);
          });
          // 测试连接
          keyvInstance.on('connect', () => {
            console.log('Redis connected successfully');
          });
          console.log('Attempting to connect to Redis...');
          return {
            stores: [keyvInstance],
            ttl: 30 * 1000 * 30,
          };
        } catch (error) {
          console.error('Failed to create Redis store:', error);
          throw error;
        }
      },
    }),
    MailModule,
    UserModule,
    // PrismaModule,
    // TypeOrmModule.forRootAsync({
    //   inject: [ConfigService],
    //   useFactory: (configService: ConfigService) =>
    //     ({
    //       type: configService.get('DB_TYPE'),
    //       host: configService.get('DB_HOST'),
    //       port: configService.get('DB_PORT'),
    //       username: configService.get('DB_USERNAME'),
    //       password: configService.get('DB_PASSWORD'),
    //       database: configService.get('DB_DATABASE'),
    //       autoLoadEntities: Boolean(configService.get('DB_AUTOLOAD', false)),
    //       synchronize: Boolean(configService.get('DB_SYNC', false)),
    //     }) as TypeOrmModuleOptions,
    // }),
    TypeOrmModule.forRootAsync({
      // name: 'mysql1',
      inject: [],
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options) => {
        console.log('keys====>', connections.keys());

        const tenantId = options['tenantId'] || 'default';
        if (tenantId && connections.has(tenantId)) {
          console.log('使用缓存数据源');
          return connections.get(tenantId);
        }
        console.log('dataSource====>');

        // 拿到tenantId
        const dataSource = await new DataSource(options).initialize();
        connections.set(tenantId, dataSource);
        return dataSource;
      },
      extraProviders: [],
    }),
    TypeOrmModule.forFeature([User]),
    // TypeOrmModule.forFeature([User], 'mysql1'),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'TYPEORM_CONNECTION',
      useValue: connections,
    },
  ],
})
export class AppModule {}
