import { ClientProxy } from '@nestjs/microservices'
import { Test, TestingModule } from '@nestjs/testing'
import { EMAIL_SERVICE, SEND_PASSWORD_RESET } from 'src/consts'
import { MailService } from './mail.service'

describe('MailService', () => {
  let service: MailService
  let client: ClientProxy

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        {
          provide: EMAIL_SERVICE,
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile()

    service = module.get<MailService>(MailService)
    client = module.get<ClientProxy>(EMAIL_SERVICE)
  })

  it('should be able to emit an event', () => {
    const email = 'email'
    const token = 'token'
    const url = `http://localhost:3000/v1/auth/reset-password?token=${token}`

    jest.spyOn(client, 'emit').mockImplementation()

    service.forgotPassword(email, token)

    expect(client.emit).toHaveBeenCalledTimes(1)
    expect(client.emit).toHaveBeenCalledWith(SEND_PASSWORD_RESET, { email, url })
  })
})
