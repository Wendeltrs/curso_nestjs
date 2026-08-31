import { Body, Controller, Get, HttpStatus, Post, UseGuards } from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { AuthenticatedUser } from 'src/common/decorators/authenticated-user/authenticated-user.decorator'
import { Serializer } from 'src/common/decorators/serializer/serializer.decorator'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth/jwt-auth.guard'
import { User } from 'src/models/user'
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

  @Get('/me')
  @ApiResponse({ status: HttpStatus.OK, type: User })
  @UseGuards(JwtAuthGuard)
  @Serializer(User)
  public async getMe(@AuthenticatedUser() user: User) {
    return user
  }
}
