import { UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test, TestingModule } from '@nestjs/testing'
import * as bcrypt from 'bcrypt'
import { validationError } from 'src/common/mocks/tests.mocks'
import { PrismaService } from 'src/common/services/prisma/prisma.service'
import { SessionService } from 'src/common/services/session/session.service'
import { MailService } from '../mail/mail.service'
import { mockedUsers } from '../users/users.mocks'
import { UsersService } from '../users/users.service'
import { mockedReturnAuth, mockedSignIn, mockedSignUp } from './auth.mocks'
import { AuthService } from './auth.service'

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}))

describe('AuthService', () => {
  let service: AuthService
  let usersService: UsersService
  let jwtService: JwtService
  let mail: MailService
  let prisma: PrismaService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            get: jest.fn(),
            getEmail: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('token'),
            verify: jest.fn(),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            user: {
              update: jest.fn(),
              findFirst: jest.fn(),
            },
          },
        },
        {
          provide: MailService,
          useValue: {
            forgotPassword: jest.fn(),
          },
        },
        {
          provide: SessionService,
          useValue: {
            getUserId: jest.fn().mockReturnValue('user-1'),
          },
        },
      ],
    }).compile()

    service = module.get<AuthService>(AuthService)
    usersService = module.get<UsersService>(UsersService)
    jwtService = module.get<JwtService>(JwtService)
    mail = module.get<MailService>(MailService)
    prisma = module.get<PrismaService>(PrismaService)
  })

  describe('Sign Up', () => {
    it('should be able to sign up a user', async () => {
      jest.spyOn(usersService, 'create').mockResolvedValue(mockedUsers[0])
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(mockedUsers[0].password as never)

      const result = await service.signUp(mockedSignUp)

      expect(result).toEqual(mockedReturnAuth)
      expect(usersService.create).toHaveBeenCalledTimes(1)
      expect(jwtService.sign).toHaveBeenCalledTimes(1)
      expect(bcrypt.hash).toHaveBeenCalledWith(mockedUsers[0].password, 12)
    })

    it('should be able to handle validation errors', async () => {
      jest.spyOn(usersService, 'create').mockRejectedValue(validationError)

      await expect(service.signUp({ name: '', email: '', password: '' })).rejects.toThrow(
        validationError,
      )
    })
  })

  describe('Sign In', () => {
    it('should be able to sign in a user', async () => {
      jest.spyOn(usersService, 'getEmail').mockResolvedValue(mockedUsers[0])
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never)

      const result = await service.signIn(mockedSignIn)

      expect(result).toEqual(mockedReturnAuth)
      expect(usersService.getEmail).toHaveBeenCalledTimes(1)
      expect(jwtService.sign).toHaveBeenCalledTimes(1)
      expect(bcrypt.compare).toHaveBeenCalledWith(mockedUsers[0].password, mockedUsers[0].password)
    })

    it('should be able to throw an error if user is not authorized', async () => {
      const error = new UnauthorizedException()

      jest.spyOn(usersService, 'getEmail').mockRejectedValue(error)
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never)

      await expect(service.signIn({ email: '', password: '' })).rejects.toThrow(error)
      expect(usersService.getEmail).toHaveBeenCalledTimes(1)
    })
  })

  describe('Forgot Password', () => {
    it('should be able to send a forgot password email', async () => {
      jest.spyOn(usersService, 'getEmail').mockResolvedValue(mockedUsers[0])
      jest.spyOn(mail, 'forgotPassword').mockImplementation()

      const result = await service.forgotPassword(mockedUsers[0].email)

      expect(result).toEqual({ message: 'Password request email sent' })
      expect(usersService.getEmail).toHaveBeenCalledTimes(1)
      expect(jwtService.sign).toHaveBeenCalledTimes(1)
    })

    it('should be able to throw an error if user is not authorized', async () => {
      const error = new UnauthorizedException()

      jest.spyOn(usersService, 'getEmail').mockRejectedValue(error)

      await expect(service.forgotPassword('')).rejects.toThrow(error)
    })
  })

  describe('Resest Password', () => {
    it('should be able to reset password', async () => {
      const mockedPayload = {
        sub: mockedUsers[0].id,
        email: mockedUsers[0].email,
        purpose: 'reset_password',
      }

      jest.spyOn(jwtService, 'verify').mockResolvedValue(mockedPayload as never)
      jest.spyOn(usersService, 'get').mockResolvedValue(mockedUsers[0])
      jest.spyOn(bcrypt, 'hash').mockReturnValue(mockedUsers[0].password as never)
      jest.spyOn(prisma.user, 'update').mockResolvedValue(mockedUsers[0])

      const result = await service.resetPassword('token', mockedUsers[0].password)

      expect(result).toEqual({ message: 'Password updated' })
      expect(jwtService.verify).toHaveBeenCalledTimes(1)
      expect(usersService.get).toHaveBeenCalledTimes(1)
      expect(prisma.user.update).toHaveBeenCalledTimes(1)
      expect(bcrypt.hash).toHaveBeenCalledWith(mockedUsers[0].password, 12)
    })

    it('should be able to throw an error if user is not authorized', async () => {
      const error = new UnauthorizedException('Invalid token')

      jest.spyOn(jwtService, 'verify').mockRejectedValue(error as never)
      jest.spyOn(usersService, 'get').mockRejectedValue(error)

      await expect(service.resetPassword('', '')).rejects.toThrow(error)
    })
  })

  describe('Change Password', () => {
    it('should be able to change password', async () => {
      jest.spyOn(usersService, 'get').mockResolvedValue(mockedUsers[0])
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never)
      jest.spyOn(prisma.user, 'update').mockResolvedValue(mockedUsers[0])

      const result = await service.changePassword({
        password: mockedUsers[0].password,
        newPassword: mockedUsers[0].password,
      })

      expect(result).toEqual({ message: 'Password updated' })
      expect(usersService.get).toHaveBeenCalledTimes(1)
      expect(prisma.user.update).toHaveBeenCalledTimes(1)
      expect(bcrypt.hash).toHaveBeenCalledWith(mockedUsers[0].password, 12)
    })

    it('should be able to throw an error if user is not authorized', async () => {
      const error = new UnauthorizedException()

      jest.spyOn(usersService, 'get').mockRejectedValue(error)

      await expect(
        service.changePassword({
          password: '',
          newPassword: '',
        }),
      ).rejects.toThrow(error)
      expect(usersService.get).toHaveBeenCalledTimes(1)
    })
  })

  describe('Get Me', () => {
    it('should be able to return user if authorized', async () => {
      jest.spyOn(prisma.user, 'findFirst').mockResolvedValue(mockedUsers[0])

      const result = await service.getMe(mockedUsers[0].id)

      expect(result).toEqual(mockedUsers[0])
      expect(prisma.user.findFirst).toHaveBeenCalledTimes(1)
    })

    it('should be able to throw an error if user is not authorized', async () => {
      const error = new UnauthorizedException()

      jest.spyOn(prisma.user, 'findFirst').mockRejectedValue(error)

      await expect(service.getMe(mockedUsers[0].id)).rejects.toThrow(error)
      expect(prisma.user.findFirst).toHaveBeenCalledTimes(1)
    })
  })
})
