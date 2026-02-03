import { UseInterceptors } from '@nestjs/common';
import { SerializeInterceptor } from '../interceptors/serialize.interceptor';

export interface ClassConstructor {
  new (...args: any[]): any;
}
export function Serialize(dto: ClassConstructor, flag?: boolean) {
  return UseInterceptors(new SerializeInterceptor(dto, flag));
}
