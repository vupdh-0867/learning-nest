import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';

import { QueueService } from './queue.service';
import { SendMailProcessor } from './processors/send-mail.processor';
import { SendMailModule } from '../mailer/send-mail.module';
import { QueueConStant } from '../shared/constants/queue.constant';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QueueConStant.sendMail,
    }),
    SendMailModule,
  ],
  providers: [QueueService, SendMailProcessor],
  exports: [QueueService],
})
export class QueueModule {}
