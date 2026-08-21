import { Controller } from '@nestjs/common'
import { EventPattern, Payload } from '@nestjs/microservices'
import { MailerService } from '@nestjs-modules/mailer'
import { SEND_PASSWORD_RESET } from 'src/consts'

@Controller()
export class MailConsumer {
  constructor(private mailerService: MailerService) {}

  @EventPattern(SEND_PASSWORD_RESET)
  async handleResetPassword(@Payload() data: { email: string; url: string }) {
    await this.mailerService.sendMail({
      to: data.email,
      subject: 'Redefinição de senha',
      template: 'forgot-password.hbs',
      context: {
        url: data.url,
      },
    })
  }
}
