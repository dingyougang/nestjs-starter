import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpException,
  HttpStatus,
  ParseArrayPipe,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninUserDto } from './dto/signin-user.dto';
import { CreateUserPipe } from './pipes/create-user.pipe';
import { SerializeInterceptor } from '@/common/interceptors/serialize.interceptor';
import { PublicUserDto } from './dto/public-user.dto';
import { Serialize } from '@/common/decorators/serialize.decorator';

@Controller('auth')
// @UseInterceptors(SerializeInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/signin')
  signin(@Body() dto: SigninUserDto) {
    console.log('🚀 ~ AuthController ~ signin ~ dto:', dto);
    const { username, password } = dto;
    return this.authService.signin(username, password);
  }
  @Post('/signup')
  // 内置拦截器
  // @UseInterceptors(ClassSerializerInterceptor)
  // 自定义拦截器
  @Serialize(PublicUserDto, true)
  async signup(
    @Body(CreateUserPipe) dto: SigninUserDto,
  ): Promise<PublicUserDto> {
    const { username, password } = dto;
    console.log('🚀 ~ AuthController ~ signup ~ dto:', dto);
    const user = await this.authService.signup(username, password);
    user.test = {
      roles: [1, 2],
      date: '2026-01-01',
    };
    console.log('🚀 ~ AuthController ~ signup ~ user:', user);
    return user;
    // return new PublicUserDto({ ...user });
    // const { username, password, roles } = dto;
    // if (!username || !password) {
    //   throw new HttpException('用户名或密码不能为空', HttpStatus.BAD_REQUEST);
    // }
    // return dto;
    // return this.authService.signup(username, password);
  }
  // @Post('/signup')
  // signup(
  //   @Body(new ParseArrayPipe({ items: SigninUserDto })) dto: SigninUserDto[],
  // ) {
  //   return dto;
  // }
}
