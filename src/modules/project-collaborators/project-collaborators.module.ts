import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { ProjectCollaboratorsController } from './project-collaborators.controller'
import { ProjectCollaboratorsService } from './project-collaborators.service'

@Module({
  controllers: [ProjectCollaboratorsController],
  providers: [ProjectCollaboratorsService, PrismaService],
})
export class ProjectCollaboratorsModule {}
