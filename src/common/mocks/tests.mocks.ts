import { ExecutionContext } from '@nestjs/common'
import { of } from 'rxjs'
import { QueryDto } from '../decorators/query/query.decorator'

export const mockPaginationQuery: QueryDto = {
  skip: 0,
  take: 10,
  orderBy: {},
  where: {},
}

export const mockedQueryForTaskAndCollaborator = {
  ...mockPaginationQuery,
  projectId: 'project-1',
}

export const validationError = new Error('Validation error')

export const mockedExecutionContext = {
  switchToHttp: jest.fn().mockReturnThis(), //mockReturnThis: retorna o escopo do módulo atual
  getHandler: jest.fn(),
} as unknown as ExecutionContext

export const mockedCallHandler = {
  handle: jest.fn(() => of({})), //of: ajuda o ts a reconhecer que o handle vai retornar um observable
}
