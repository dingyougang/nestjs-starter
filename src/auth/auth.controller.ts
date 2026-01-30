import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  ParseArrayPipe,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninUserDto } from './dto/signin-user.dto';
import { CreateUserPipe } from './pipes/create-user.pipe';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/signin')
  signin(@Body() dto: SigninUserDto) {
    console.log("🚀 ~ AuthController ~ signin ~ dto:", dto)
    const { username, password } = dto;
    return this.authService.signin(username, password);
  }
  @Post('/signup')
  signup(@Body(CreateUserPipe) dto: SigninUserDto) {
    const { username, password, roles } = dto;
    if (!username || !password) {
      throw new HttpException('用户名或密码不能为空', HttpStatus.BAD_REQUEST);
    }
    return dto;
    // return this.authService.signup(username, password);
  }
  // @Post('/signup')
  // signup(
  //   @Body(new ParseArrayPipe({ items: SigninUserDto })) dto: SigninUserDto[],
  // ) {
  //   return dto;
  // }
}
