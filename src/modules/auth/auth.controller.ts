import { Body, Controller, HttpStatus, Post } from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import {
  AuthenticatedDTO,
  ForgotPasswordDTO,
  MessageDTO,
  ResetPasswordDTO,
  SignInDTO,
  SignUpDTO,
} from './auth.dto'
import { AuthService } from './auth.service'

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-up')
  @ApiResponse({ status: HttpStatus.CREATED, type: AuthenticatedDTO })
  public async signUp(@Body() data: SignUpDTO) {
    return await this.authService.signUp(data)
  }

  @Post('sign-in')
  @ApiResponse({ status: HttpStatus.OK, type: AuthenticatedDTO })
  public async signIn(@Body() data: SignInDTO) {
    return await this.authService.signIn(data)
  }

  @Post('forgot-password')
  @ApiResponse({ status: HttpStatus.OK, type: MessageDTO })
  public async forgotPassword(@Body() data: ForgotPasswordDTO) {
    return await this.authService.forgotPassword(data.email)
  }

  @Post('reset-password')
  @ApiResponse({ status: HttpStatus.OK, type: MessageDTO })
  public async resetPassword(@Body() data: ResetPasswordDTO) {
    return await this.authService.resetPassword(data.token, data.newPassword)
  }
}
