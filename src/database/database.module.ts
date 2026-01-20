import { Module } from '@nestjs/common';
import { TypeormCommonModule } from './typeorm/typeorm-common.module';
import { PrismaCommonModule } from './prisma/prisma-common.module';
// import { UserRepository } from '@/user/user.repository';

@Module({
  imports: [TypeormCommonModule, PrismaCommonModule],
  providers: [
    // UserRepository
  ],
  exports: [
    // UserRepository
  ],
})
export class DatabaseModule {}
