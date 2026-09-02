import { Body, Controller, Get, HttpStatus, Post, Res, UseGuards } from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import type { Response } from 'express'
import { AuthenticatedUser } from 'src/common/decorators/authenticated-user/authenticated-user.decorator'
import { Serializer } from 'src/common/decorators/serializer/serializer.decorator'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth/jwt-auth.guard'
import { User } from 'src/models/user'
import {
  ChangePasswordDTO,
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
  @ApiResponse({ status: HttpStatus.CREATED, type: MessageDTO })
  public async signUp(@Body() data: SignUpDTO) {
    return await this.authService.signUp(data)
  }

  @Post('sign-in')
  @ApiResponse({ status: HttpStatus.OK, type: MessageDTO })
  public async signIn(@Body() data: SignInDTO, @Res({ passthrough: true }) response: Response) {
    const token = await this.authService.signIn(data)

    response.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24,
    })

    return { message: 'Signed in successfully' }
  }

  @Post('logout')
  @ApiResponse({ status: HttpStatus.OK, type: MessageDTO })
  public logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    })

    return {
      message: 'Logout successful',
    }
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

  @Post('change-password')
  @ApiResponse({ status: HttpStatus.OK, type: MessageDTO })
  @UseGuards(JwtAuthGuard)
  public async changePassword(@Body() data: ChangePasswordDTO) {
    return await this.authService.changePassword(data)
  }

  @Get('/me')
  @ApiResponse({ status: HttpStatus.OK, type: User })
  @UseGuards(JwtAuthGuard)
  @Serializer(User)
  public async getMe(@AuthenticatedUser() getUser: User) {
    return this.authService.getMe(getUser.id)
  }
}
