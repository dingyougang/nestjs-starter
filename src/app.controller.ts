import { Controller, Get, Version } from '@nestjs/common';

@Controller({
  // version: '1',
})
export class AppController {
  constructor() {}

  @Get()
  // @Version('1')
  getHello(): string {
    return 'hello world Version1';
  }
  @Get()
  @Version('2')
  getHelloV2(): string {
    return 'hello world Version2';
  }
}
