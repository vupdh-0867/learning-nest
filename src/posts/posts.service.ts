import { Injectable, BadRequestException } from '@nestjs/common';
import { createObjectCsvStringifier } from 'csv-writer';
import * as ExcelJS from 'exceljs';

import { PostRepository } from './post.repository';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from '../entities/post.entity';
import { FileService } from '../multer/file.service';
import { UserDto } from '../user/dtos/user.dto';
import { QueueService } from '../queue/queue.service';
import { ExcelService } from '../media/excel/excel.service';
import { PdfService } from '../media/pdf/pdf.service';

@Injectable()
export class PostsService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly fileService: FileService,
    private readonly queueService: QueueService,
    private readonly excelService: ExcelService,
    private readonly pdfService: PdfService,
  ) {}

  async create(
    createPostDto: CreatePostDto,
    user: UserDto,
    file: Express.Multer.File,
  ): Promise<Post> {
    if (await this.postRepository.findOneBy({ title: createPostDto.title })) {
      throw new BadRequestException(['Title has been taken!']);
    }

    const post = await this.postRepository.createPostAndTags(
      createPostDto,
      user.id,
      file,
    );
    this.queueService.sendMailCreatePost(user, post);

    return this.attachPresignedUrl(post);
  }

  async update(
    id: string,
    updatePostDto: UpdatePostDto,
    userId: string,
    file: Express.Multer.File,
  ): Promise<Post> {
    const post = await this.postRepository.createPostAndTags(
      {
        ...updatePostDto,
        id,
      },
      userId,
      file,
    );

    return this.attachPresignedUrl(post);
  }

  async findAll(): Promise<Post[]> {
    const posts: Post[] = await this.postRepository.find();
    const promisePresignedUrls = [];
    posts.forEach(({ fileName }) => {
      promisePresignedUrls.push(
        this.fileService.generatePresignedUrl(fileName),
      );
    });
    const presignedUrls: string[] = await Promise.all(promisePresignedUrls);

    return posts.map((post, index) => ({
      ...post,
      fileName: presignedUrls[index],
    }));
  }

  async findOne(id: string): Promise<Post> {
    const post = await this.postRepository.findOneByOrFail({ id });
    if (!post) {
      throw new BadRequestException([`This ${Post.name} does not exist!`]);
    }

    return this.attachPresignedUrl(post);
  }

  async remove(userId: string, id: string): Promise<Post> {
    const post = await this.postRepository.findOneByOrFail({
      userId: userId,
      id: id,
    });
    if (!post) {
      throw new BadRequestException([`This ${Post.name} does not exist!`]);
    }

    this.postRepository.softDelete(post.id);

    return post;
  }

  async exportCsv(): Promise<string> {
    const posts: Post[] = await this.postRepository.find();
    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: 'id', title: 'ID' },
        { id: 'title', title: 'Title' },
        { id: 'description', title: 'Description' },
      ],
    });
    const records = posts.map((product) => ({
      id: product.id,
      title: product.title,
      description: product.description,
    }));
    const csvData =
      csvStringifier.getHeaderString() +
      csvStringifier.stringifyRecords(records);

    return csvData;
  }

  async exportExcel(): Promise<ExcelJS.Workbook> {
    const posts: Post[] = await this.postRepository.find();

    return this.excelService.exportListPosts(posts);
  }

  exportPdf() {
    return this.pdfService.drawPackingSlip();
  }

  private async attachPresignedUrl(post: Post): Promise<Post> {
    return {
      ...post,
      fileName: await this.fileService.generatePresignedUrl(post.fileName),
    };
  }
}
