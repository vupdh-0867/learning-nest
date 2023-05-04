import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { createMock } from '@golevelup/ts-jest';
import { Repository } from 'typeorm';

import { PostsService } from '../../src/posts/posts.service';
import { PostRepository } from '../../src/posts/post.repository';
import { CreatePostDto } from '../../src/posts/dto/create-post.dto';
import { FileService } from '../../src/multer/file.service';
import { Post } from '../../src/entities/post.entity';
import { User } from '../../src/entities/user.entity';
import { UpdatePostDto } from '../../src/posts/dto/update-post.dto';

describe('PostService', () => {
  let service: PostsService;
  let repo: Repository<Post>;
  const postArray = [
    new Post('title 1', 'this is description'),
    new Post('title 2', 'this is description'),
  ];
  const testTitle = 'title 1';
  const testDescription = 'this is description';
  const onePost = new Post(testTitle, testDescription, 'uploaded_example.com');
  const user = new User(
    'test_user',
    '2222',
    'phan.dang.hai.vu@sun-asterisk.com',
  );

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: PostRepository,
          useValue: {
            find: jest.fn().mockReturnValue(postArray),
            findOneByOrFail: jest.fn().mockReturnValue(onePost),
            createPostAndTags: jest.fn().mockReturnValue(onePost),
            findOneBy: jest.fn().mockReturnValue(null),
            softDelete: jest.fn().mockReturnValue(onePost),
          },
        },
        {
          provide: FileService,
          useValue: {
            generatePresignedUrl: jest
              .fn()
              .mockReturnValue('uploaded_example.com'),
            uploadFile: jest.fn().mockReturnValue('uploaded_example'),
          },
        },
      ],
    })
      .useMocker(() => createMock())
      .compile();

    service = module.get<PostsService>(PostsService);
    repo = module.get<PostRepository>(PostRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of posts', async () => {
      const posts = await service.findAll();

      expect(posts).toEqual(
        postArray.map((post) => ({
          ...post,
          fileName: 'uploaded_example.com',
        })),
      );
    });
  });

  describe('findOne', () => {
    describe('post exists', () => {
      it('should return post', async () => {
        const post = await service.findOne('valid_id');
        const repoSpy = jest.spyOn(repo, 'findOneByOrFail');

        expect(post).toEqual(onePost);
        expect(repoSpy).toBeCalledWith({ id: 'valid_id' });
      });
    });

    describe('post does not exist', () => {
      it('should raise not found error', async () => {
        jest.spyOn(repo, 'findOneByOrFail').mockResolvedValue(null);

        expect(service.findOne('invalid_id')).rejects.toThrow(
          new BadRequestException(['This Post does not exist!']),
        );
      });
    });
  });

  describe('create', () => {
    describe('create post successfully', () => {
      it('should return created post', async () => {
        const createPostDTO = new CreatePostDto(testTitle, testDescription);
        const mockFile = {
          fieldname: 'example',
          originalname: 'example.jpg',
          encoding: '7bit',
          mimetype: 'image/jpeg',
          buffer: Buffer.from(__dirname + '/../../example.jpg'),
          size: 518,
        } as Express.Multer.File;
        const post = await service.create(createPostDTO, user, mockFile);

        expect(post).toEqual(onePost);
      });
    });

    describe('create post with title exist in database', () => {
      it('should raise bad request error', async () => {
        const createPostDTO = new CreatePostDto(testTitle, testDescription);
        const mockFile = {
          fieldname: 'example',
          originalname: 'example.jpg',
          encoding: '7bit',
          mimetype: 'image/jpeg',
          buffer: Buffer.from(__dirname + '/../../example.jpg'),
          size: 518,
        } as Express.Multer.File;
        jest.spyOn(repo, 'findOneBy').mockResolvedValue(onePost);

        expect(service.create(createPostDTO, user, mockFile)).rejects.toThrow(
          new BadRequestException(['Title has been taken!']),
        );
      });
    });
  });

  describe('update', () => {
    const updatePostDTO = new UpdatePostDto(testTitle, testDescription);
    const mockFile = {
      fieldname: 'example',
      originalname: 'example.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      buffer: Buffer.from(__dirname + '/../../example.jpg'),
      size: 518,
    } as Express.Multer.File;

    describe('post does not exist', () => {
      it('should raise not found error', async () => {
        jest.spyOn(repo, 'findOneByOrFail').mockResolvedValue(null);

        expect(
          service.update('invalid_id', updatePostDTO, 'user_id', mockFile),
        ).rejects.toThrow(
          new BadRequestException(['This Post does not exist!']),
        );
      });
    });

    describe('post exists', () => {
      it('should update successfully and return post', async () => {
        const repoSpy = jest.spyOn(repo, 'findOneByOrFail');
        const post = await service.update(
          'valid_id',
          updatePostDTO,
          'user_id',
          mockFile,
        );

        expect(post).toEqual(onePost);
        expect(repoSpy).toBeCalledWith({ userId: 'user_id', id: 'valid_id' });
      });
    });
  });

  describe('remove', () => {
    describe('post exists', () => {
      it('should return post', async () => {
        const repoSpy = jest.spyOn(repo, 'findOneByOrFail');
        const post = await service.remove('user_id', 'valid_id');

        expect(post).toEqual(onePost);
        expect(repoSpy).toBeCalledWith({ userId: 'user_id', id: 'valid_id' });
      });
    });

    describe('post does not exist', () => {
      it('should raise not found error', async () => {
        jest.spyOn(repo, 'findOneByOrFail').mockResolvedValue(null);

        expect(service.remove('user_id', 'invalid_id')).rejects.toThrow(
          new BadRequestException(['This Post does not exist!']),
        );
      });
    });
  });
});
