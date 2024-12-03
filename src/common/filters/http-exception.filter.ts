import { Injectable, ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { ErrorHttpException } from '../errors/error-http.exception';
import { Response } from 'express';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorLogEntity } from '../entities/error-log.entity';

@Injectable()
@Catch(ErrorHttpException)
export class CustomHttpExceptionFilter implements ExceptionFilter {
  constructor(
    @InjectRepository(ErrorLogEntity)
    private readonly errorLogRepository: Repository<ErrorLogEntity>, // Inject repository for logging to DB
  ) {}

  async catch(exception: ErrorHttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

   
    await this.logErrorToDatabase(exception, request);

    
    response.status(status).json({
      statusCode: exception.statusCode,
      message: exception.message,
      error: exception.error,
    });
  }

  private async logErrorToDatabase(exception: ErrorHttpException, request: Request) {
    try {
      const errorLog = new ErrorLogEntity();
      errorLog.statusCode = exception.statusCode;
      errorLog.message = exception.message;
      errorLog.error = exception.error;
      errorLog.errorDetails = exception.errorDetails
        ? JSON.stringify(exception.errorDetails)
        : null;
      errorLog.controller = request.url;
      errorLog.method = request.method;
      errorLog.ipAddress = request.headers['x-forwarded-for'] || '0.0.0.0';
      errorLog.timestamp = new Date();
  
      await this.errorLogRepository.save(errorLog);
    } catch (error) {
      console.error('Failed to log error to database:', error);
    }
  }
}