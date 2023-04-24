import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';

import { Post } from '../../entities/post.entity';

@Injectable()
export class ExcelService {
  async exportListPosts(posts: Post[]): Promise<ExcelJS.Workbook> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Data');
    worksheet.columns = [
      { header: 'Id', key: 'id', width: 30 , style: { font: {bold: true } }},
      { header: 'Title', key: 'name', width: 10 },
      { header: 'Description.', key: 'DOB', width: 30}
    ];

    posts.forEach((post) => {
      worksheet.addRow([post.id, post.title, post.description]);
    });

    return workbook;
  }
}
