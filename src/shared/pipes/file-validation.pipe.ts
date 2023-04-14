import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { AppConStant } from '../constants/app.constant';

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.data === 'file' && value) {
      if (AppConStant.fileSize < value.size) throw new BadRequestException(['File is too large!']);
      if (!AppConStant.fileTypes.includes(value.mimetype)) throw new BadRequestException(['File is invalid!']);
    }

    return value;
  }
}
