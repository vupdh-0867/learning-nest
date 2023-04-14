import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(BadRequestException)
export class BadRequestExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const errors = exception.getResponse();
    const status = exception.getStatus();
    const response = ctx.getResponse<Response>();
    let errorResponse = [];

    if (Array.isArray(errors.message)) {
      errorResponse = errors.message;
    } else {
      errorResponse.push(errors);
    }

    return response.status(status).json({
      statusCode: status,
      errors: errorResponse,
    });
  }
}
