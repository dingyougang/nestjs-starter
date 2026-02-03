import { Exclude, Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { SigninUserDto } from './signin-user.dto';

class TestDto {
  @Expose()
  @Type(() => String)
  roles: string[];
  @Expose()
  @Type(() => Date)
  date: Date;
}
export class PublicUserDto extends SigninUserDto {
  //   @IsString()
  //   @IsNotEmpty()
  //   id: string;

  //   @IsString()
  //   @IsNotEmpty()
  //   username: string;

  //   @IsString()
  //   @IsNotEmpty()

  @Expose()
  id: string;
  @Expose()
  username: string;
  @Exclude()
  password: string;
  @Expose()
  test: TestDto;
  // constructor(partial: Partial<PublicUserDto>) {
  //   super();
  //   Object.assign(this, partial);
  // }
}
