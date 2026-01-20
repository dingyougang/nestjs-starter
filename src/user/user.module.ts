import { Module } from '@nestjs/common';
import { UserController } from './user.controller';

import { User } from './entities/user.entity';
import { TYPEORM_DATABASE } from '@/database/database.constants';
import { UserTypeormRepository } from './repositories/typeorm.repositor';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPrismaRepository } from './repositories/prisma.repositor';
import { UserRepository } from './user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User], TYPEORM_DATABASE)],
  controllers: [UserController],
  providers: [UserTypeormRepository, UserPrismaRepository, UserRepository],
  // exports: [UserRepository],
})
export class UserModule {}
