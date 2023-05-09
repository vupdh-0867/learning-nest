import { Test, TestingModule } from '@nestjs/testing';

import { QueueService } from './queue.service';
import { UserDto } from '../user/dtos/user.dto';
import { Post } from '../entities/post.entity';
import { BullModule } from '@nestjs/bull';

describe('QueueService', () => {
  let service: QueueService;
  const mSendMailQueue = {
    add: jest.fn().mockReturnValue('send mail successfully'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        BullModule.registerQueue({
          name: 'send-mail-queue',
        }),
      ],
      providers: [
        QueueService,
        {
          provide: 'send-mail-queue',
          useValue: mSendMailQueue,
        },
      ],
    }).compile();
    service = module.get<QueueService>(QueueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('send', () => {
    it('send mail successfully', async () => {
      const user = new UserDto();
      const post = new Post();
      service.sendMailCreatePost(user, post);
      expect(mSendMailQueue.add).toBeCalledWith(
        'sendMailCreatePostJob',
        { user, post },
        { attempts: 3},
      );
    });
  });
});
