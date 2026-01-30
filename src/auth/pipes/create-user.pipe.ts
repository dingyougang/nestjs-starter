import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class CreateUserPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!value) return;
    const { roles } = value;
    if (roles && roles instanceof Array) {
      value.roles = roles.map((item) => {
        return parseInt(item);
      });
    }
    return value;
  }
}
