import { Injectable } from '@nestjs/common'
import { CollaboratorRole } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'
import { QueryDto } from 'src/services/query/query.decorator'
import { ProjectCreateDTO, ProjectUpdateDTO } from './projects.dto'

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  public async getAll(query: QueryDto) {
    return await this.prisma.project.findMany({
      skip: query?.skip,
      take: query?.take,
      orderBy: query?.orderBy,
      where: {
        ...query.where,
        deletedAt: null,
      },
      include: {
        tasks: true,
        creator: true,
      },
    })
  }

  public async get(id: string) {
    return await this.prisma.project.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        tasks: true,
        creator: true,
      },
    })
  }

  public async create(data: ProjectCreateDTO) {
    const project = await this.prisma.project.create({
      data: {
        name: data.name,
        description: data.description,
        creatorId: data.creatorId,
      },
    })

    await this.prisma.projectCollaborator.create({
      data: {
        userId: data.creatorId,
        projectId: project.id,
        role: CollaboratorRole.OWNER,
      },
    })

    return project
  }

  public async update(id: string, data: ProjectUpdateDTO) {
    return await this.prisma.project.update({
      where: {
        id,
      },
      data: {
        name: data.name,
        description: data.description,
        creatorId: data.creatorId,
      },
    })
  }

  public async delete(id: string) {
    await this.prisma.task.updateMany({
      where: {
        projectId: id,
      },
      data: {
        deletedAt: new Date(),
      },
    })

    return await this.prisma.project.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    })
  }
}
