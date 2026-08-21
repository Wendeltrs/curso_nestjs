import { Module } from '@nestjs/common'
import { SessionService } from 'src/common/services/session/session.service'
import { PrismaService } from 'src/prisma/prisma.service'
import { ProjectCollaboratorsController } from './project-collaborators.controller'
import { ProjectCollaboratorsService } from './project-collaborators.service'

@Module({
  controllers: [ProjectCollaboratorsController],
  providers: [ProjectCollaboratorsService, PrismaService, SessionService],
})
export class ProjectCollaboratorsModule {}
