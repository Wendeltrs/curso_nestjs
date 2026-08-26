import { Module } from '@nestjs/common'
import { PrismaService } from 'src/common/services/prisma/prisma.service'
import { SessionService } from 'src/common/services/session/session.service'
import { CommentsController } from './comments.controller'
import { CommentsService } from './comments.service'

@Module({
  controllers: [CommentsController],
  providers: [CommentsService, PrismaService, SessionService],
})
export class CommentsModule {}
