import { AdminGuard } from '@/common/guards/admin.guard';
import { UserRepository } from '@/user/user.repository';
import {
  Controller,
  Get,
  ParseIntPipe,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
@UseGuards(AuthGuard('jwt'), AdminGuard)
export class UserController {
  constructor(private userRepository: UserRepository) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  // @Version('1')
  async getUser(
    @Query('id', ParseIntPipe) id: number,
    @Req() req: any,
  ): Promise<any> {
    console.log('🚀 ~ UserController ~ getUser ~ req:', req);
    console.log(typeof id, 'id');
    return await this.userRepository.findOne(id);
  }
  @Get('test')
  // @UseGuards(AuthGuard('jwt'), AdminGuard)
  test() {
    return 'ok';
  }
}
