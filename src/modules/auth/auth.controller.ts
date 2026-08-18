import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { AuthenticatedUser } from 'src/common/decorators/authenticated-user/authenticated-user.decorator'
import { User } from 'src/models/user'
import { SignInDTO, SignUpDTO } from './auth.dto'
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

  @Get('protected')
  @UseGuards(AuthGuard('jwt'))
  public async protected(@AuthenticatedUser() user: User) {
    return {
      message: `Authenticated: ${user.email}`,
    }
  }
}
