import { Injectable } from '@nestjs/common'
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

  public get(id: string) {
    return this.prisma.project.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    })
  }

  public create(data: ProjectDTO) {
    return this.prisma.project.create({
      data: {
        name: data.name,
        description: data.description,
      }
    })
  }

  public update(id: string, data: ProjectDTO) {
    return this.prisma.project.update({
      where: {
        id,
      },
      data: {
        name: data.name,
        description: data.description,
      }
    })
  }

  public delete(id: string) {
    return this.prisma.project.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      }
    })
  }
}
