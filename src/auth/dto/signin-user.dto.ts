import { Transform } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class SigninUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(5, 12, {
    message: '用户名长度在5-12之间',
  })
  username: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 20, {
    message: ({ value, property, constraints }) => {
      return `密码长度在5-20之间,当前值是${value}`;
    },
  })
  password: string;
  @IsArray()
  @IsOptional()
  //   @IsNumber({}, { each: true })
  //   @Transform((params) => {
  //     return params.value.map((item: string) => parseInt(item));
  //   })
  roles: number[];
}
