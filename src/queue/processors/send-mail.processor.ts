import { OnQueueActive, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

import { SendMailService } from '../../mailer/send-mail.service';
import { QueueConStant } from '../../shared/constants/queue.constant';

@Processor(QueueConStant.sendMail)
export class SendMailProcessor {
  constructor(private readonly sendMailService: SendMailService) {}

  @OnQueueActive()
  onActive(job: Job) {
    console.log(
      `Processing job ${job.id} of type ${job.name} with data ${job.data}...`,
    );
  }

  @Process('sendMailCreatePostJob')
  async sendMailCreatePostJob(job: Job) {
    const user = job.data.user;
    const post = job.data.post;

    this.sendMailService.send(
      user.email,
      'Post created successfully!',
      'create-post',
      {
        username: user.username,
        title: post.title,
      },
    );
  }
}
