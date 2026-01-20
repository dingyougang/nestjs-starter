import { UserRepository } from '@/user/user.repository';
import { Controller, Get } from '@nestjs/common';

@Controller('user')
export class UserController {
  constructor(private userRepository: UserRepository) {}

  @Get()
  // @Version('1')
  async findAll(): Promise<any[]> {
    const res = await this.userRepository.find();
    console.log('🚀 ~ UserController ~ findAll ~ res:', res);
    return res;
  }
}
