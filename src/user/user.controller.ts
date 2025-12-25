import { UserRepository } from './user.repository';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Version,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
// import { UpdateUserDto } from './dto/update-user.dto';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { User } from './entities/user.entity';

@Controller('user')
export class UserController {
  private userRepository: Repository<User>;
  constructor(
    private readonly userService: UserService,
    // @InjectRepository(User) private readonly userRepository: Repository<User>,
    // @InjectRepository(User, 'mysql1')
    // private readonly userRepository1: Repository<User>,
    private repository: UserRepository,
  ) {
    this.userRepository = this.repository.getRepository();
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  // @Version('1')
  async findAll() // @Query('db') db: string
  : Promise<any> {
    // const res = await (db == 'mysql1'
    // ? this.userRepository1.find()
    //   : this.userRepository.find());
    // console.log('🚀 ~ UserController ~ findAll ~ res:', res);
    // return res;
    const res = await this.userRepository.find();
    return res;
  }
  @Get()
  @Version('2')
  async findAll2(): Promise<any> {
    // const res = await this.userRepository1.find();
    // console.log('🚀 ~ UserController1 ~ findAll ~ res:', res);
    // return res;
    // return this.userService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.userService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.userService.remove(+id);
  // }
}
