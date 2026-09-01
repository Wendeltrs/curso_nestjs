import { Injectable } from '@nestjs/common'
import { CollaboratorRole } from '@prisma/client'
import { QueryDto } from 'src/common/decorators/query/query.decorator'
import { PrismaService } from 'src/common/services/prisma/prisma.service'
import { SessionService } from 'src/common/services/session/session.service'
import { ProjectCreateDTO, ProjectUpdateDTO } from './projects.dto'

@Injectable()
export class ProjectsService {
  constructor(
    private readonly prisma: PrismaService,
    private session: SessionService,
  ) {}

  public async getAll(query?: QueryDto) {
    return await this.prisma.extensions.project.findManyAndCount({
      skip: query?.skip,
      take: query?.take,
      orderBy: query?.orderBy,
      where: {
        ...query?.where,
        creatorId: this.session.getUserId(),
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
        creatorId: this.session.getUserId(),
        deletedAt: null,
      },
      include: {
        tasks: true,
        creator: true,
      },
    })
  }

  public async create(data: ProjectCreateDTO) {
    console.log(data)
    const project = await this.prisma.project.create({
      data: {
        name: data.name,
        description: data.description,
        creatorId: this.session.getUserId(),
      },
    })

    await this.prisma.projectCollaborator.create({
      data: {
        userId: this.session.getUserId(),
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
        creatorId: this.session.getUserId(),
      },
      data: {
        name: data.name,
        description: data.description,
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

    await this.prisma.project.update({
      where: {
        id,
        creatorId: this.session.getUserId(),
      },
      data: {
        deletedAt: new Date(),
      },
    })
  }
}
