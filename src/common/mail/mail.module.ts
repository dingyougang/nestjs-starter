import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
@Module({
  imports: [
    //  MailerModule.forRootAsync({
    //    useFactory: () => ({})
    // 邮箱服务
    MailerModule.forRoot({
      transport: 'smtps://794389453@qq.com:ijrqowkgignmbebc@smtp.qq.com',
      defaults: {
        from: '"ganggang" <<794389453@qq.com>>',
      },
      template: {
        dir: __dirname + '/templates',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class MailModule {}
