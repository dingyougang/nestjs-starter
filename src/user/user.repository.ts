import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

export class UserRepository {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    // @InjectRepository(User, 'mysql1')
    // private userRepository1: Repository<User>,
    @Inject(REQUEST)
    private request: Request,
  ) {}
  getRepository() {
    // const { query } = this.request;
    // const { db } = query;
    // const headers = this.request.headers;
    // const tenantId = headers['x-tenant-id'];
    // if (tenantId == 'mysql1') {
    //   return this.userRepository1;
    // }
    // return this.userRepository;
  }
}
