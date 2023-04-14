import { QueryFailedError } from 'typeorm/error/QueryFailedError';
import { Response } from 'express';
import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';

import { ErrorConstant } from '../../errors/error.constant';

@Catch(QueryFailedError)
export class QueryFailedErrorFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const errors = this.queryFailedError(
      exception,
      parseInt(exception.code, 0),
      exception.table,
    );
    let status: number;

    if (errors) {
      status = HttpStatus.BAD_REQUEST;
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    return response
      .status(status)
      .json({ statusCode: status, message: ErrorConstant.alreadyExist });
  }

  private queryFailedError(exception: any, errorCode: number, entity: string) {
    switch (errorCode) {
      case 23505: {
        const message = ErrorConstant.uniqueViolation;
        const property = exception.detail
          .match(ErrorConstant.GetPropertyInMessageRegex)[1]
          .split(', ')
          .pop();

        return { message, entity, property };
      }
    }
  }
}
