import { MailerService } from '@nestjs-modules/mailer';
import {
  Cache,
  CACHE_MANAGER,
  //  CacheInterceptor
} from '@nestjs/cache-manager';
import {
  Controller,
  Get,
  Inject,
  Query,
  // UseInterceptors,
  Version,
} from '@nestjs/common';
// import { InjectRedis } from '@nestjs-modules/ioredis';
// import Redis from 'ioredis';
// let a = 1;
@Controller({
  // version: '1',
})
// @UseInterceptors(CacheInterceptor)
export class AppController {
  constructor(
    // 1.注册redis模块
    // @InjectRedis() private readonly redis: Redis,
    // 1.注册cache模块
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly mailerService: MailerService,
  ) {}

  @Get()
  // @Version('1')
  getHello(): string {
    return 'hello world Version1';
  }
  @Get()
  @Version('2')
  async getHelloV2(@Query('token') token: string): Promise<any> {
    //2. redis使用
    // const res = await this.redis.get('token');
    // await this.redis.set('token', '123456', 'EX', 60 * 10);
    // a = a + 1;
    // return a
    // 2. cache使用
    const res = await this.cacheManager.get('token');
    console.log('🚀 ~ AppController ~ getHelloV2 ~ res:', res, token);
    await this.cacheManager.set('token', token || 'default token', 3 * 1000);
    return {
      token: res,
    };
    // return 'hello world Version2';
  }
  @Get('mail')
  sendMail() {
    console.log('🚀 ~ AppController ~ sendMail ~ sendMail:');
    this.mailerService
      .sendMail({
        to: '2826155358@qq.com',
        from: '794389453@qq.com',
        subject: 'test',
        template: 'welcome', // 指定模板名称，不需要后缀
        context: {
          // 模板上下文数据
          name: 'gang-gang',
        },
        // 也可以使用text属性发送纯文本邮件
        // text: 'hello world',
      })
      .then(() => {
        console.log('发送邮件成功');
      })
      .catch((err) => {
        console.log('发送邮件失败', err);
      });
    return 'sendMail';
  }
}
