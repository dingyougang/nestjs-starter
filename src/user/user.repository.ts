import { UserPrismaRepository } from './repositories/prisma.repositor';
import { UserTypeormRepository } from './repositories/typeorm.repositor';
import { Inject, Optional } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { UserAbstractRepository } from './user-abstract.repository';
import { UserAdapter } from './user.interface';

export class UserRepository implements UserAbstractRepository {
  constructor(
    @Inject(REQUEST)
    private request: Request,
    @Optional()
    private userTypeormRepository: UserTypeormRepository,
    @Optional()
    private userPrismaRepository: UserPrismaRepository,
  ) {}
  find(username: string): Promise<any[]> {
    const client = this.getRepository();
    return client.find(username);
  }
  findOne(id: number): Promise<any> {
    const client = this.getRepository();
    return client.findOne(id);
  }
  create(userObj: any): Promise<any> {
    const client = this.getRepository();
    return client.create(userObj);
  }
  update(userObj: any): Promise<any> {
    const client = this.getRepository();
    return client.update(userObj);
  }
  delete(id: number): Promise<any> {
    const client = this.getRepository();
    return client.delete(id);
  }
  getRepository(): UserAdapter {
    // 根据tenant逻辑返回不同的repository
    const headers = this.request.headers;
    const tenantId = headers['x-tenant-id'] || 'default';
    console.log('🚀 ~ UserRepository ~ getRepository ~ tenantId:', tenantId);
    if (tenantId == 'mysql1') {
      return this.userPrismaRepository;
    } else if (tenantId == 'mysql2') {
      return this.userTypeormRepository;
    } else {
      // ...TODO
      return this.userTypeormRepository;
    }
  }
}
