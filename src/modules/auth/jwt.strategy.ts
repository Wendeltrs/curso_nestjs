import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET!,
    })
  }

  public async validate(payload: { sub: string; purpose: string }) {
    if (payload.purpose === 'reset_password') {
      throw new UnauthorizedException('Invalid token')
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.sub,
      },
    })

    if (!user) {
      return null
    }

    return user
  }
}
