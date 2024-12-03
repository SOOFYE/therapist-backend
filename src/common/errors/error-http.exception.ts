import { HttpException, HttpStatus } from '@nestjs/common';

export class ErrorHttpException extends HttpException {
  public readonly statusCode: HttpStatus;
  public readonly error: string;
  public readonly errorDetails?: any;

  constructor(
    statusCode: HttpStatus,
    message: string,
    error: string,
    errorDetails?: any,
  ) {
    super(
      {
        statusCode,
        message,
        error,
        errorDetails,
      },
      statusCode,
    );

    this.statusCode = statusCode; 
    this.error = error;
    this.errorDetails = errorDetails;
  }
}