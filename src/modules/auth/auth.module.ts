import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { CloudinaryService } from 'src/common/services/cloudinary/cloudinary.service'
import { PrismaService } from 'src/common/services/prisma/prisma.service'
import { SessionService } from 'src/common/services/session/session.service'
import { MailModule } from '../mail/mail.module'
import { MailService } from '../mail/mail.service'
import { UsersService } from '../users/users.service'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtStrategy } from './jwt.strategy'

@Module({
  imports: [
    MailModule,
    PassportModule,
    JwtModule.register({ secret: process.env.JWT_SECRET, signOptions: { expiresIn: '1d' } }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
    UsersService,
    JwtStrategy,
    MailService,
    SessionService,
    CloudinaryService,
  ],
})
export class AuthModule {}
