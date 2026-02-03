import { UserRepository } from '@/user/user.repository';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private jwt: JwtService,
  ) {}
  async signin(username: string, password: string) {
    const user = await this.userRepository.find(username);
    console.log('🚀 ~ AuthService ~ signin ~ user:', user);
    if (!user) {
      throw new ForbiddenException('用户不存在');
    }
    const isPasswordValid = await argon2.verify(user[0].password, password);
    if (!isPasswordValid) {
      throw new ForbiddenException('密码错误');
    }
    const access_token = await this.jwt.signAsync({
      username: user[0].username,
    });
    return {
      access_token,
    };
  }
  async signup(username: string, password: string) {
    const user = await this.userRepository.find(username);
    if (user.length) {
      throw new ForbiddenException('用户已存在');
    }
    return this.userRepository.create({ username, password });
  }
}
