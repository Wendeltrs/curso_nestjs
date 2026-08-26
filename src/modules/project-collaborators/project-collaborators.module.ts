import { Module } from '@nestjs/common'
import { PrismaService } from 'src/common/services/prisma/prisma.service'
import { SessionService } from 'src/common/services/session/session.service'
import { ProjectCollaboratorsController } from './project-collaborators.controller'
import { ProjectCollaboratorsService } from './project-collaborators.service'

@Module({
  controllers: [ProjectCollaboratorsController],
  providers: [ProjectCollaboratorsService, PrismaService, SessionService],
})
export class ProjectCollaboratorsModule {}
