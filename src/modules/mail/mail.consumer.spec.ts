import { Test } from '@nestjs/testing'
import { MailerService } from '@nestjs-modules/mailer'
import { MailConsumer } from './mail.consumer'
import { MailModule } from './mail.module'

describe('MailConsumer', () => {
  let consumer: MailConsumer
  let mailerService: MailerService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [MailModule],
    })
      .overrideProvider(MailerService)
      .useValue({
        sendMail: jest.fn(),
      })
      .compile()

    consumer = module.get<MailConsumer>(MailConsumer)
    mailerService = module.get<MailerService>(MailerService)
  })

  it('should be able to send an email', () => {
    jest.spyOn(mailerService, 'sendMail').mockImplementation()

    consumer.handleResetPassword({ email: 'email', url: 'url' })

    expect(mailerService.sendMail).toHaveBeenCalledTimes(1)
    expect(mailerService.sendMail).toHaveBeenCalledWith({
      to: 'email',
      subject: 'Redefinição de senha',
      template: 'forgot-password.hbs',
      context: {
        url: 'url',
      },
    })
  })
})
