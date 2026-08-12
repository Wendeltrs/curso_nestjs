import { Body, Controller, Post } from '@nestjs/common'
import { AuthService } from './auth.service'

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private AuthService: AuthService) {}

  @Post()
  public async signUp(@Body() data: any) {}
}
