import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { PrismaService } from 'src/common/services/prisma/prisma.service'
import { SessionService } from 'src/common/services/session/session.service'
import { MailService } from '../mail/mail.service'
import { UsersService } from '../users/users.service'
import { ChangePasswordDTO, SignInDTO, SignUpDTO } from './auth.dto'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
    private mail: MailService,
    private session: SessionService,
  ) {}

  public async signUp(data: SignUpDTO) {
    const hashedPassword = await bcrypt.hash(data.password, 12)

    await this.usersService.create({
      ...data,
      password: hashedPassword,
    })

    return { message: 'Signed up successfully' }
  }

  public async signIn(data: SignInDTO) {
    const user = await this.usersService.getEmail(data.email)

    if (user && (await bcrypt.compare(data.password, user.password))) {
      const token = this.jwtService.sign({
        sub: user.id,
        email: user.email,
        role: user.role,
      })

      return token
    }

    throw new UnauthorizedException()
  }

  public async forgotPassword(email: string) {
    const user = await this.usersService.getEmail(email)

    if (!user) {
      throw new UnauthorizedException()
    }

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      purpose: 'reset_password',
    })

    this.mail.forgotPassword(email, token)

    return {
      message: 'Password request email sent',
    }
  }

  public async resetPassword(token: string, newPassword: string) {
    const payload = await this.jwtService.verify(token)
    const user = await this.usersService.get(payload.sub)

    if (payload.purpose !== 'reset_password' && !user) {
      throw new UnauthorizedException('Invalid token')
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12)

    await this.prisma.user.update({
      where: {
        id: payload.sub,
      },
      data: {
        password: hashedPassword,
      },
    })

    return {
      message: 'Password updated',
    }
  }

  public async changePassword(data: ChangePasswordDTO) {
    const user = await this.usersService.get(this.session.getUserId())

    if (user && (await bcrypt.compare(data.currentPassword, user.password))) {
      const hashedPassword = await bcrypt.hash(data.newPassword, 12)

      await this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          password: hashedPassword,
        },
      })

      return {
        message: 'Password updated',
      }
    }

    throw new UnauthorizedException()
  }

  public async getMe(id: string) {
    const user = await this.prisma.user.findFirst({
      where: { id },
    })

    if (!user) {
      throw new UnauthorizedException()
    }

    return user
  }
}
