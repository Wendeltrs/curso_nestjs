import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { QueryDto } from 'src/services/query/query.decorator'
import { ProjectCreateDTO, ProjectUpdateDTO } from './projects.dto'

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  public getAll(query: QueryDto) {
    return this.prisma.project.findMany({
      where: {
        ...query.where,
        deletedAt: null,
      },
    })
  }

  public async get(id: string) {
    const project = await this.prisma.project.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    })

    if (!project) {
      throw new HttpException('Project not found', HttpStatus.NOT_FOUND)
    }

    return project
  }

  public create(data: ProjectCreateDTO) {
    return this.prisma.project.create({
      data: {
        name: data.name,
        description: data.description,
      },
    })
  }

  public async update(id: string, data: ProjectUpdateDTO) {
    const project = await this.prisma.project.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    })

    if (!project) {
      throw new HttpException('Project not found', HttpStatus.NOT_FOUND)
    }

    return this.prisma.project.update({
      where: {
        id: project.id,
      },
      data: {
        name: data.name,
        description: data.description,
      },
    })
  }

  public async delete(id: string) {
    const project = await this.prisma.project.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    })

    if (!project) {
      throw new HttpException('Project not found', HttpStatus.NOT_FOUND)
    }

    return this.prisma.project.update({
      where: {
        id: project.id,
      },
      data: {
        deletedAt: new Date(),
      },
    })
  }
}
