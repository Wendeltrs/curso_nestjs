import 'reflect-metadata'
import { lastValueFrom, of } from 'rxjs'
import { mockedExecutionContext } from 'src/common/mocks/tests.mocks'
import { User } from 'src/models/user'
import { mockedUsers } from 'src/modules/users/users.mocks'
import { SerializerInterceptor } from './serializer.interceptor'

describe('SerializerInterceptor', () => {
  let interceptor: SerializerInterceptor
  const user = mockedUsers[0]

  beforeEach(async () => {
    interceptor = new SerializerInterceptor(User) //Cria o interceptor para usar a classe User
  })

  it('should be able to serialize the response', async () => {
    const next = {
      handle: jest.fn().mockReturnValue(of(user)), //mocka o handle para retornar um observable contendo o user
    }
    const result$ = interceptor.intercept(mockedExecutionContext, next)
    const result = await lastValueFrom(result$) //lastValueFrom: pega o ultimo valor do observable

    expect(result).toEqual({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt,
      tasksAssigned: [],
      comments: [],
      projects: [],
      collaborations: [],
    })
    expect(result).not.toHaveProperty('password')
    expect(next.handle).toHaveBeenCalledTimes(1)
  })
})
