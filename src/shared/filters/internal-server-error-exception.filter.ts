import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

import { ErrorConstant } from '../../errors/error.constant';

@Catch()
export class InternalServerErrorExceptionFilter implements ExceptionFilter {
  catch(_exception: any, host: ArgumentsHost) {
    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(status).json({
      statusCode: status,
      message: ErrorConstant.internalServer,
    });
  }
}
