import { Test, TestingModule } from '@nestjs/testing';
import { FileService } from './file.service';
import { S3 } from 'aws-sdk';

describe('FileService', () => {
  let service: FileService;
  const mockFile = {
    fieldname: 'example',
    originalname: 'example.jpg',
    encoding: '7bit',
    mimetype: 'image/jpeg',
    buffer: Buffer.from(__dirname + '/../../example.jpg'),
    size: 518,
  } as Express.Multer.File;
  const mS3Instance = {
    upload: jest.fn().mockReturnThis(),
    promise: jest.fn(),
    getSignedUrlPromise: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FileService,
        {
          provide: S3,
          useValue: mS3Instance,
        },
      ],
    }).compile();

    service = module.get<FileService>(FileService);
    jest.spyOn(service, 'generateFileKey').mockImplementation((filename) => {
      return `8068bb6-${filename}`;
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('uploadFile', () => {
    it('return file key after upload successfully', async () => {
      mS3Instance.promise.mockResolvedValue({ Key: 'fake key' });
      process.env.BUCKET_NAME = 'test-bucket';
      const actual = await service.uploadFile(mockFile);
      expect(actual).toEqual('fake key');
      expect(mS3Instance.upload).toBeCalledWith({
        Bucket: process.env.BUCKET_NAME,
        Key: '8068bb6-example.jpg',
        Body: mockFile.buffer,
      });
    });
  });

  describe('generatePresignedUrl', () => {
    describe('when key is null', () => {
      it('return file key after upload successfully', async () => {
        const url = await service.generatePresignedUrl(null);
        expect(url).toEqual('');
      });
    });

    describe('when key is valid', () => {
      it('return file presigned url', async () => {
        mS3Instance.getSignedUrlPromise.mockResolvedValue(
          'http://example.com/example.jpg',
        );
        const url = await service.generatePresignedUrl('example.jpg');
        expect(url).toEqual('http://example.com/example.jpg');
      });
    });
  });
});
