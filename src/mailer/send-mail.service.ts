import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class SendMailService {
  constructor(private readonly mailerService: MailerService) {}

  public send(
    receivers: string | string[],
    subject: string,
    template: string,
    context = {},
  ): void {
    this.mailerService.sendMail({
      to: receivers,
      subject: subject,
      template: template,
      context: context,
    });
  }
}
