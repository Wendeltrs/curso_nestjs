import { Test, TestingModule } from '@nestjs/testing'
import { validationError } from 'src/common/mocks/tests.mocks'
import { SessionService } from 'src/common/services/session/session.service'
import { mockedUsers } from '../users/users.mocks'
import { AuthController } from './auth.controller'
import { mockedSignIn, mockedSignUp } from './auth.mocks'
import { AuthModule } from './auth.module'
import { AuthService } from './auth.service'

describe('AuthController', () => {
  let controller: AuthController
  let service: AuthService
  const user = mockedUsers[0]

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    })
      .overrideProvider(AuthService)
      .useValue({
        getMe: jest.fn(),
        signUp: jest.fn(),
        signIn: jest.fn(),
        changePassword: jest.fn(),
        forgotPassword: jest.fn(),
        resetPassword: jest.fn(),
      })
      .overrideProvider(SessionService)
      .useValue({ getUserId: jest.fn().mockReturnValue('user-1') })
      .compile()

    controller = module.get<AuthController>(AuthController)
    service = module.get<AuthService>(AuthService)
  })

  describe('Sign Up', () => {
    it('should be able to sign up a user', async () => {
      jest.spyOn(service, 'signUp').mockResolvedValue({ message: 'Signed up successfully' })

      const result = await controller.signUp(mockedSignUp)

      expect(result).toEqual({ message: 'Signed up successfully' })
      expect(service.signUp).toHaveBeenCalledTimes(1)
      expect(service.signUp).toHaveBeenCalledWith(mockedSignUp)
    })

    it('should be able to handle validation errors', async () => {
      jest.spyOn(service, 'signUp').mockRejectedValue(validationError)

      await expect(controller.signUp({ name: '', email: '', password: '' })).rejects.toThrow(
        validationError,
      )
    })
  })

  describe('Sign In', () => {
    it('should be able to sign in a user', async () => {
      jest.spyOn(service, 'signIn').mockResolvedValue('token')
      
      const response = { cookie: jest.fn() }
      const result = await controller.signIn(mockedSignIn, response as never)

      expect(result).toEqual({ message: 'Signed in successfully' })
      expect(service.signIn).toHaveBeenCalledTimes(1)
      expect(service.signIn).toHaveBeenCalledWith(mockedSignIn)
    })

    it('should be able to handle validation errors', async () => {
      const response = { cookie: jest.fn() }

      jest.spyOn(service, 'signIn').mockRejectedValue(validationError)

      await expect(controller.signIn({ email: '', password: '' }, response as never)).rejects.toThrow(validationError)
    })
  })
  
  describe('Log Out', () => {
    it('should be able to log out a user', async () => {      
      const response = { clearCookie: jest.fn() }
      const result = controller.logout(response as never)

      expect(result).toEqual({ message: 'Logout successful' })
    })
  })

  describe('Forgot Password', () => {
    it('should be able to send a forgot password email', async () => {
      jest
        .spyOn(service, 'forgotPassword')
        .mockResolvedValue({ message: 'Password request email sent' })

      const result = await controller.forgotPassword({ email: user.email })

      expect(result).toEqual({ message: 'Password request email sent' })
      expect(service.forgotPassword).toHaveBeenCalledTimes(1)
      expect(service.forgotPassword).toHaveBeenCalledWith(user.email)
    })

    it('should be able to handle validation errors', async () => {
      jest.spyOn(service, 'forgotPassword').mockRejectedValue(validationError)

      await expect(controller.forgotPassword({ email: '' })).rejects.toThrow(validationError)
    })
  })

  describe('Reset Password', () => {
    it('should be able to reset password', async () => {
      jest.spyOn(service, 'resetPassword').mockResolvedValue({ message: 'Password updated' })

      const result = await controller.resetPassword({ newPassword: user.password, token: 'token' })

      expect(result).toEqual({ message: 'Password updated' })
      expect(service.resetPassword).toHaveBeenCalledTimes(1)
      expect(service.resetPassword).toHaveBeenCalledWith('token', user.password)
    })

    it('should be able to handle validation errors', async () => {
      jest.spyOn(service, 'resetPassword').mockRejectedValue(validationError)

      await expect(controller.resetPassword({ newPassword: '', token: '' })).rejects.toThrow(
        validationError,
      )
    })
  })

  describe('Change Password', () => {
    it('should be able to change password', async () => {
      jest.spyOn(service, 'changePassword').mockResolvedValue({ message: 'Password updated' })

      const result = await controller.changePassword({
        currentPassword: user.password,
        newPassword: user.password,
      })

      expect(result).toEqual({ message: 'Password updated' })
      expect(service.changePassword).toHaveBeenCalledTimes(1)
      expect(service.changePassword).toHaveBeenCalledWith({
        currentPassword: user.password,
        newPassword: user.password,
      })
    })
  })

  describe('Get Me', () => {
    it('should be able to receive the user by decorator', async () => {
      jest.spyOn(service, 'getMe').mockResolvedValue(user)

      const result = await controller.getMe(user as never)

      expect(result).toEqual(user)
      expect(service.getMe).toHaveBeenCalledTimes(1)
      expect(service.getMe).toHaveBeenCalledWith(user.id)
    })
  })
})
