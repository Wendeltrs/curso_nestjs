import { Module } from '@nestjs/common'
import { PrismaService } from 'src/common/services/prisma/prisma.service'
import { SessionService } from 'src/common/services/session/session.service'
import { TasksController } from './tasks.controller'
import { TasksService } from './tasks.service'

@Module({
  controllers: [TasksController],
  providers: [TasksService, PrismaService, SessionService],
})
export class TasksModule {}
