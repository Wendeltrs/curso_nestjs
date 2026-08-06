import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { PaginatorInterceptor } from '../../interceptors/paginator/paginator.interceptor';

export const Paginator = () => {
  return applyDecorators(UseInterceptors(new PaginatorInterceptor()));
};
