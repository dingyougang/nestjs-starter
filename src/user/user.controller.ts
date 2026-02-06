import { Public } from '@/common/decorators/public.decorator';
import { Permission, Read, Update } from '@/common/decorators/role-decorator';
import { AdminGuard } from '@/common/guards/admin.guard';
import { JwtGuard } from '@/common/guards/jwt.guard';
import { RolePermissionGuard } from '@/common/guards/role-permission.guard';
import { UserRepository } from '@/user/user.repository';
import {
  Controller,
  Get,
  ParseIntPipe,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';

@Controller('user')
// @UseGuards(AuthGuard('jwt'), AdminGuard)
// @UseGuards(JwtGuard, AdminGuard)
@UseGuards(RolePermissionGuard)
@Permission('user')
@Permission('user1')
export class UserController {
  constructor(private userRepository: UserRepository) {}

  @Get()
  // @UseGuards(AuthGuard('jwt'))
  // @Version('1')
  @Read()
  async getUser(
    @Query('id', ParseIntPipe) id: number,
    @Req() req: any,
  ): Promise<any> {
    // console.log('🚀 ~ UserController ~ getUser ~ req:', req);
    console.log(typeof id, 'id');
    return await this.userRepository.findOne(id);
  }
  @Public()
  @Get('test')
  @Update()
  @Read()
  // @UseGuards(AuthGuard('jwt'), AdminGuard)
  test() {
    return 'ok';
  }
}
