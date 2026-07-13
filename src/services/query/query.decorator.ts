import { BadRequestException, createParamDecorator, ExecutionContext } from '@nestjs/common'
import { getPrismaWhere } from 'src/prisma/prisma.utils'

export class QueryDto {
  skip: number
  take: number
  orderBy: Record<string, 'asc' | 'desc'>
  where?: Record<string, string>
}

export const QueryPaginator = createParamDecorator((_data: unknown, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest()

  const { perPage = 30, page = 1, sortBy, sortOrder = 'desc', query } = request.query

  if (perPage > 500) {
    throw new BadRequestException('The maximum per-page limit is 30')
  }

  const where = getPrismaWhere(query)

  return {
    skip: (page - 1) * perPage,
    take: Number(perPage),
    where: where,
    ...(sortBy && {
      orderBy: {
        [sortBy]: sortOrder,
      },
    }),
  }
})
