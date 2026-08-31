import { ExecutionContext } from '@nestjs/common'
import { lastValueFrom, of } from 'rxjs'
import { mockedUsers } from 'src/modules/users/users.mocks'
import { PaginatorInterceptor } from './paginator.interceptor'

describe('PaginatorInterceptor', () => {
  let interceptor: PaginatorInterceptor

  beforeEach(() => {
    interceptor = new PaginatorInterceptor()
  })

  it('should be able to paginate the response', async () => {
    const next = {
      handle: jest.fn().mockReturnValue(of([mockedUsers, mockedUsers.length])),
    }

    const context = {
      switchToHttp: () => ({
        getResponse: () => ({
          setHeader: jest.fn(),
        }),
      }),
    } as unknown as ExecutionContext

    const result$ = interceptor.intercept(context, next)
    const result = await lastValueFrom(result$)

    expect(result).toEqual(mockedUsers)
    expect(next.handle).toHaveBeenCalledTimes(1)
  })
  
  it('should be able to handle validation errors', async () => {
    const error = new Error('Incorrect data to paginator format')

    const next = {
      handle: jest.fn().mockReturnValue(of(mockedUsers[0])),
    }

    const context = {
      switchToHttp: () => ({
        getResponse: () => ({
          setHeader: jest.fn(),
        }),
      }),
    } as unknown as ExecutionContext

    const result$ = interceptor.intercept(context, next)

    await expect(lastValueFrom(result$)).rejects.toThrow(error)
    expect(next.handle).toHaveBeenCalledTimes(1)
  })
})
