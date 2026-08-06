import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { ClassConstructor } from 'class-transformer';
import { SerializerInterceptor } from 'src/common/interceptors/serializer/serializer.interceptor';

export const Serializer = (useClass: ClassConstructor<unknown>) => {
  return applyDecorators(UseInterceptors(new SerializerInterceptor(useClass)));
};
