import { Module } from '@nestjs/common';

import { PdfService } from './pdf/pdf.service';
import { ExcelService } from './excel/excel.service';

@Module({
  providers: [PdfService, ExcelService],
  exports: [PdfService, ExcelService],
})
export class MediaModule {}
