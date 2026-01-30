import { Inject } from '@nestjs/common';
import { UserAbstractRepository } from '../user-abstract.repository';
import { PrismaClient } from '@prisma/client';
import { PRISMA_DATABASE } from '@/database/database.constants';

export class UserPrismaRepository implements UserAbstractRepository {
  constructor(
    @Inject(PRISMA_DATABASE)
    private prismaClient: PrismaClient,
  ) {}
  find(username: string): Promise<any[]> {
    return this.prismaClient.user.findMany({
      where: {
        username,
      },
    });
  }
  findOne(id: number): Promise<any> {
    return this.prismaClient.user.findUnique({
      where: {
        id,
      },
    });
  }
  create(userObj: any): Promise<any> {
    return this.prismaClient.user.create({
      data: userObj,
    });
  }
  update(userObj: any): Promise<any> {
    return this.prismaClient.user.update({
      where: {
        id: userObj.id,
      },
      data: userObj,
    });
  }
  delete(id: number): Promise<any> {
    return this.prismaClient.user.delete({
      where: {
        id,
      },
    });
  }
}
