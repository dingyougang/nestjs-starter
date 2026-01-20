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

import { DatabaseModule } from './database/database.module';

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
    DatabaseModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
