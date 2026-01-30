import { UserRepository } from '@/user/user.repository';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly userRepository: UserRepository) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    console.log('🚀 ~ AdminGuard ~ canActivate ~ req:', req.user);
    if (req.user) {
      const { username } = req.user;
      const user = await this.userRepository.find(username);
      console.log('🚀 ~ AdminGuard ~ canActivate ~ user:', user[0].username);
    }
    return true;
  }
}
