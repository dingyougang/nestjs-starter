import { DataSource, DataSourceOptions } from 'typeorm';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
export function getEnv(env: string): Record<string, unknown> {
  if (fs.existsSync(env)) {
    return dotenv.parse(fs.readFileSync(env));
  }
}

export function buildConnectOptions() {
  const defaultConfig = getEnv('.env');
  const envConfig = getEnv(`.env.${process.env.NODE_ENV || 'development'}`);
  const config = {
    ...defaultConfig,
    ...envConfig,
  };
  console.log('🚀 ~ buildConnectOptions ~ config:', config);
  return {
    type: config['DB_TYPE'],
    host: config['DB_HOST'],
    port: config['DB_PORT'],
    username: config['DB_USERNAME'],
    password: config['DB_PASSWORD'],
    database: config['DB_DATABASE'],
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: Boolean(config['DB_SYNC']),
    autoLoadEntities: Boolean(config['DB_AUTOLOAD']),
  } as TypeOrmModuleOptions;
}

export default new DataSource({
  ...buildConnectOptions(),
} as DataSourceOptions);
