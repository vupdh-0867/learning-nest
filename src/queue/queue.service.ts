import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

import { QueueConStant } from '../shared/constants/queue.constant';
import { UserDto } from '../user/dtos/user.dto';
import { Post } from '../entities/post.entity';

@Injectable()
export class QueueService {
  constructor(@InjectQueue(QueueConStant.sendMail) private mailQueue: Queue) {}

  sendMailCreatePost(user: UserDto, post: Post) {
    this.mailQueue.add(
      'sendMailCreatePostJob',
      { user, post },
      {
        attempts: QueueConStant.retry,
      },
    );
  }
}
