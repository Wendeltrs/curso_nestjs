import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { PrismaService } from 'src/prisma/prisma.service'
import { MailService } from '../mail/mail.service'
import { UsersService } from '../users/users.service'
import { SignInDTO, SignUpDTO } from './auth.dto'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
    private mail: MailService,
  ) {}

  public async signUp(data: SignUpDTO) {
    const hashedPassword = await bcrypt.hash(data.password, 12)

    const newUser = await this.usersService.create({
      ...data,
      password: hashedPassword,
    })

    const token = this.jwtService.sign({
      sub: newUser.id,
      email: newUser.email,
      role: newUser.role,
    })

    return {
      token: token,
    }
  }

  public async signIn(data: SignInDTO) {
    const user = await this.usersService.getEmail(data.email)

    if (user && (await bcrypt.compare(data.password, user.password))) {
      const token = this.jwtService.sign({
        sub: user.id,
        email: user.email,
        role: user.role,
      })

      return {
        token: token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      }
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
      porpuse: 'reset_password',
    })

    await this.mail.forgotPassword(email, token)

    return {
      message: 'Password request email sent',
    }
  }

  public async resetPassword(token: string, newPassword: string) {
    const payload = await this.jwtService.verify(token)
    const user = await this.usersService.get(payload.sub)

    if (payload.porpuse !== 'reset_password' && !user) {
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
}
