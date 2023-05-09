import { Test, TestingModule } from '@nestjs/testing';
import { MailerService } from '@nestjs-modules/mailer';

import { SendMailService } from './send-mail.service';

describe('SendMailService', () => {
  let service: SendMailService;
  const mMailerInstance = {
    sendMail: jest.fn().mockReturnValue('send mail successfully'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SendMailService,
        {
          provide: MailerService,
          useValue: mMailerInstance,
        },
      ],
    }).compile();
    service = module.get<SendMailService>(SendMailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('send', () => {
    it('send mail successfully', async () => {
      service.send(
        'phandanghaivu@gmail.com',
        'Post created successfully',
        'create-post',
        { username: 'phandanghaivu' },
      );
      expect(mMailerInstance.sendMail).toBeCalledWith({
        to: 'phandanghaivu@gmail.com',
        subject: 'Post created successfully',
        template: 'create-post',
        context: { username: 'phandanghaivu' },
      });
    });
  });
});
