import { Logger } from '@nestjs/common';
import { catchError, retry, throwError, timer } from 'rxjs';

export const PROTOCALREGEX = /^(.*?):\/\//;
export const getDBType = (url: string) => {
  const matches = url.match(PROTOCALREGEX);
  const protocol = matches ? matches[1] : 'file';
  return protocol === 'file' ? 'sqlite' : protocol;
};
export function handleRetry(retryAttempts: number, retryDelay: number) {
  const logger = new Logger('PrismaModule');
  return (source) =>
    source.pipe(
      retry({
        count: retryAttempts < 0 ? Infinity : retryAttempts,
        delay: (error, retryCount) => {
          const attemps = retryCount < 0 ? Infinity : retryCount;
          if (retryCount <= attemps) {
            logger.error(
              `Database connection error: retry ${retryCount} ===>`,
              error.stack,
            );
            return timer(retryDelay);
          } else {
            return throwError(() => new Error('Database connection MAX RETRY'));
          }
        },
      }),
      catchError((error) => {
        logger.error(
          `Database connection retry: ${retryAttempts} times`,
          error.stack || error,
        );
        return throwError(() => error);
      }),
    );
}
