import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common'

export const AuthenticatedUser = createParamDecorator((_data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest()
    const user = request.user

    if (!user) {
      throw new UnauthorizedException()
    }

    return user
  },
)
