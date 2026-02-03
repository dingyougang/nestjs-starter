import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { map, Observable } from 'rxjs';

@Injectable()
export class SerializeInterceptor implements NestInterceptor {
  constructor(
    private dto: any,
    private flag?: boolean,
  ) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // console.log('intercept-Before...');
    return next.handle().pipe(
      map((data) => {
        // console.log('intercept-After...');
        console.log('🚀 ~ SerializeInterceptor ~ intercept ~ data:', data);
        // delete data.password;
        // return data;
        return plainToInstance(this.dto, data, {
          // 所有经过该拦截器的接口都需要配置Expose(暴露)或者Exclude（不需要暴露）class类属性
          excludeExtraneousValues: this.flag,
          // date string 内置转换
          enableImplicitConversion: true,
        });
      }),
    );
  }
}
