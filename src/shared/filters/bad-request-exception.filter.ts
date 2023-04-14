import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { Response } from 'express';
import { ErrorConstant, HTTP_ERR_MSGS } from '../../errors/error.constant';

@Catch(BadRequestException)
export class BadRequestExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    let errors = exception.getResponse();
    const status = exception.getStatus();
    const response = ctx.getResponse<Response>();
    let errorResponse = [];

    if (
      Array.isArray(errors.message) &&
      errors.message[0] instanceof ValidationError
    ) {
      errors = errors.message;
      errorResponse = this.formatErrorValidate(errors);
    } else {
      errorResponse.push(errors);
    }

    return response.status(status).json({
      messages: HTTP_ERR_MSGS[status],
      errors: errorResponse,
    });
  }

  private formatErrorValidate(errors: any, responseError = []) {
    errors.map((error) => {
      const { resource } = error.target.constructor;

      if (error.children.length) {
        responseError.push({
          property: error.property,
          children: this.formatChildrenErrorValidate(
            error.children,
            null,
          ).filter((e) => e != null),
          resource,
        });
      } else {
        responseError.push(this.resourceError(error, resource));
      }
    });

    return responseError;
  }

  private formatChildrenErrorValidate(children, index) {
    const errors = [];

    children.forEach((error) => {
      if (error.children.length) {
        errors[error.property] = this.formatChildrenErrorValidate(
          error.children,
          +error.property,
        );
      } else {
        if (!isNaN(index)) {
          error.index = index;
        }

        errors.push(this.resourceError(error, error.target.constructor.name));
      }
    });

    return errors;
  }

  private resourceError(error, resource) {
    return {
      index: error.index,
      property: error.property,
      message: ErrorConstant[Object.keys(error.constraints).at(-1)],
      resource,
    };
  }
}
