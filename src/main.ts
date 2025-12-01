import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AllExceptionFilter } from './common/filters/all-exception.filter';
import { VERSION_NEUTRAL, VersioningType } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);
  const errFilterFlag = configService.get<string>('ERROR_FILTER');
  const cors = configService.get<boolean>('CORS', false);
  const prefix = configService.get<string>('PREFIX', '/api');
  // const versionStr = configService.get<string>('VERSION', '1');
  const versionStr = configService.get<string>('VERSION');
  let version = [versionStr];
  if (versionStr && versionStr.indexOf(',')) {
    version = [...versionStr.split(',')];
  }
  app.setGlobalPrefix(`${prefix}`);
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion:
      typeof versionStr === 'undefined' ? VERSION_NEUTRAL : version,
  });
  if (cors) {
    app.enableCors();
  }
  // 全局loggger
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  // 全局filter
  if (errFilterFlag === 'true') {
    const httpAdater = app.get(HttpAdapterHost);
    app.useGlobalFilters(new AllExceptionFilter(httpAdater));
  }

  // await app.listen(process.env.PORT ?? 3000);
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
