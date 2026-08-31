import { ExecutionContext } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { SessionService } from 'src/common/services/session/session.service'
import { User } from 'src/models/user'
import { JwtAuthGuard } from './jwt-auth.guard'

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard
  let session: SessionService
  let context: ExecutionContext

  beforeEach(() => {
    session = {
      setUser: jest.fn(),
    } as unknown as SessionService

    guard = new JwtAuthGuard(session)

    context = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: { id: '1', name: 'teste' },
        }),
      }),
    } as unknown as ExecutionContext
  })

  it('should return true and set user when authenticate successfully', async () => {
    const superCanActivate = jest.spyOn(AuthGuard('jwt').prototype, 'canActivate')
    superCanActivate.mockResolvedValue(true)

    const result = await guard.canActivate(context)

    expect(result).toBe(true)
    expect(session.setUser).toHaveBeenCalledWith({ id: '1', name: 'teste' } as User)
  })

  it('should return false when authenticate fails', async () => {
    const superCanActivate = jest.spyOn(AuthGuard('jwt').prototype, 'canActivate')
    superCanActivate.mockResolvedValue(false)

    const result = await guard.canActivate(context)

    expect(result).toBe(false)
    expect(session.setUser).not.toHaveBeenCalled()
  })

  it('should throw an error when super.canActivate throws', async () => {
    const error = new Error('Authentication failed')
    jest.spyOn(AuthGuard('jwt').prototype, 'canActivate').mockRejectedValue(error)

    await expect(guard.canActivate(context)).rejects.toThrow(error)
    expect(session.setUser).not.toHaveBeenCalled()
  })
})
