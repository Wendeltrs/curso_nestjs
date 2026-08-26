import { applyDecorators, HttpStatus, Type } from '@nestjs/common'
import { ApiExtraModels, ApiQuery, ApiResponse } from '@nestjs/swagger'

export const ApiPaginatedResponse = <T extends Type<unknown>>(model: T) => {
  return applyDecorators(
    ApiExtraModels(model),
    ApiQuery({
      name: 'page',
      required: false,
      type: 'number',
    }),

    ApiQuery({
      name: 'perPage',
      required: false,
      type: 'number',
    }),

    ApiQuery({
      name: 'sortBy',
      required: false,
      type: 'string',
    }),

    ApiQuery({
      name: 'sortOrder',
      required: false,
      enum: ['asc', 'desc'],
    }),

    ApiQuery({
      name: 'query',
      required: false,
      type: 'string',
    }),

    ApiResponse({
      status: HttpStatus.OK,
      type: [model],
    }),
  )
}
