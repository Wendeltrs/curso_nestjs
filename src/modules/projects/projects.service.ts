import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { ProjectDTO } from './projects.dto'

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  public getAll() {
    return this.prisma.project.findMany({
      where: {
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

  public create(data: ProjectDTO) {
    return this.prisma.project.create({
      data: {
        name: data.name,
        description: data.description,
      },
    })
  }

  public async update(id: string, data: ProjectDTO) {
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
