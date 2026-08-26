import { Injectable, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import * as extension from './prisma.extension'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  public extensions = this.$extends({
    model: {
      $allModels: extension,
    },
  })

  public async onModuleInit() {
    await this.$connect()
  }
}
