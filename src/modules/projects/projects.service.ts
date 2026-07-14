import { Injectable } from '@nestjs/common'
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
    return await this.prisma.project.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    })
  }

  public async create(data: ProjectCreateDTO) {
    return await this.prisma.project.create({
      data: {
        name: data.name,
        description: data.description,
      },
    })
  }

  public async update(id: string, data: ProjectUpdateDTO) {
    return this.prisma.project.update({
      where: {
        id,
      },
      data: {
        name: data.name,
        description: data.description,
      },
    })
  }

  public async delete(id: string) {
    return this.prisma.project.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    })
  }
}
