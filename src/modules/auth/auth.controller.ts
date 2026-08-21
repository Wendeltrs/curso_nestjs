import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { AuthenticatedUser } from 'src/common/decorators/authenticated-user/authenticated-user.decorator'
import { User } from 'src/models/user'
import { ForgotPasswordDTO, ResetPasswordDTO, SignInDTO, SignUpDTO } from './auth.dto'
import { AuthService } from './auth.service'

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-up')
  public async signUp(@Body() data: SignUpDTO) {
    return await this.authService.signUp(data)
  }

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  public async signIn(@Body() data: SignInDTO) {
    return await this.authService.signIn(data)
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  public async forgotPassword(@Body() data: ForgotPasswordDTO) {
    return await this.authService.forgotPassword(data.email)
  }
  
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  public async resetPassword(@Body() data: ResetPasswordDTO) {
    return await this.authService.resetPassword(data.token, data.newPassword)
  }
}
