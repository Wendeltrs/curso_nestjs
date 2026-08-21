import { ExecutionContext, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { SessionService } from 'src/common/services/session/session.service'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private sessionService: SessionService) {
    super()
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isAuthenticated = (await super.canActivate(context)) as boolean

    if (isAuthenticated) {
      const request = context.switchToHttp().getRequest()
      this.sessionService?.setUser(request.user)
    }

    return isAuthenticated
  }
}
