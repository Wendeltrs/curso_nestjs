
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { isArray } from 'class-validator';
import { Response } from 'express';
import { map } from 'rxjs';
import { ServerException } from 'src/exceptions/ServerException';

@Injectable()
export class PaginatorInterceptor implements NestInterceptor {
  public intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map((data) => {
        const http = context.switchToHttp();
        const response: Response = http.getResponse();

        if (!isArray(data)) {
          throw new ServerException('Incorrect data to paginator format');
        }

        const totalCount = data.at(1) || 0;
        response.setHeader('X-Total-Count', totalCount);

        return data.at(0) || [];
      }),
    );
  }
}
