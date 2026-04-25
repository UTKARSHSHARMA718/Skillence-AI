import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class ErrorFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = exception;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      message = typeof res === 'string' ? res : (res as any).message || message;
      error = (res as any).error || exception.name;
    }

    // new code
    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      console.error('500 Error:', {
        exception,
        path: request.url,
        method: request.method,
        body: request.body,
        params: request.params,
        query: request.query,
        timestamp: new Date().toISOString(),
      });
    } else {
      // Minimal log for other errors
      console.warn(
        ` ${status} - ${message} [${request.method} ${request.url}]`,
      );
    }

    response.status(status).json({
      success: false,
      error,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
