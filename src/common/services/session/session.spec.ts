import { User } from 'src/models/user'
import { SessionService } from './session.service'

describe('SessionService', () => {
  const service = new SessionService()

  it('should set user and return user id', () => {
    const user = { id: 'user-1' } as unknown as User

    service.setUser(user)

    expect(service.getUserId()).toEqual('user-1')
  })

  it('should set user and return user role', () => {
    const user = { role: 'USER' } as unknown as User

    service.setUser(user)

    expect(service.getRole()).toEqual('USER')
  })
})
