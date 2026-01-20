import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma.module';
import { PrismaConfigService } from './prisma.service';
import { PRISMA_DATABASE } from '../database.constants';
// import { UserPrismaRepository } from '@/user/repositories/prisma.repositor';

@Module({
  imports: [
    PrismaModule.forRootAsync({
      name: PRISMA_DATABASE,
      useClass: PrismaConfigService,
    }),
  ],
  providers: [
    // UserPrismaRepository
  ],
  exports: [
    // UserPrismaRepository
  ],
})
export class PrismaCommonModule {}
