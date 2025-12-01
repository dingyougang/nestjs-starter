import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
  LoggerService,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import * as requestIp from 'request-ip';
@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  private readonly logger: LoggerService = new Logger();
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}
  catch(exception: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();
    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const errorMsg = exception['response'] || 'Internal Server Error';
    // 加入更多逻辑
    // if(exception instanceof QueryFailedError){}
    const responseBody = {
      headers: request.headers,
      query: request.query,
      body: request.body,
      params: request.params,
      timestamp: new Date().toISOString(),
      ip: requestIp.getClientIp(request),
      exception: exception['name'],
      error: errorMsg,
    };
    this.logger.error(
      `${request.method} ${request.url} ${httpStatus}`,
      JSON.stringify(responseBody),
    );
    httpAdapter.reply(response, responseBody, httpStatus);
  }
}
