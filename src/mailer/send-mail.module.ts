import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { mailerConfig } from './mailer.config';
import { SendMailService } from './send-mail.service';

@Module({
  imports: [MailerModule.forRoot(mailerConfig)],
  providers: [SendMailService],
  exports: [SendMailService],
})
export class SendMailModule {}
