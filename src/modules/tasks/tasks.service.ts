import { Injectable, NotFoundException } from '@nestjs/common'
import { QueryDto } from 'src/common/services/query/query.decorator'
import { PrismaService } from 'src/prisma/prisma.service'
import { TaskCreateDTO, TaskUpdateDTO } from './tasks.dto'

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  public async getAll(query: QueryDto) {
    return await this.prisma.task.findMany({
      where: {
        ...query.where,
        deletedAt: null,
      },
      include: {
        project: true,
        assignee: true,
        comments: true,
      },
    })
  }

  public async get(id: string, query: QueryDto) {
    const project = await this.prisma.project.findFirst({
      where: {
        id: query?.where?.projectId,
        deletedAt: null,
      },
    })

    if (!project) {
      throw new NotFoundException('Project not found')
    }

    return await this.prisma.task.findFirst({
      where: {
        id,
        projectId: project?.id,
        deletedAt: null,
      },
      include: {
        project: true,
        assignee: true,
        comments: true,
      },
    })
  }

  public async create(data: TaskCreateDTO) {
    return await this.prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        projectId: data.projectId,
        dueDate: data.dueDate,
        assigneeId: data.assineeId,
      },
    })
  }

  public async update(id: string, data: TaskUpdateDTO) {
    return await this.prisma.task.update({
      where: {
        id,
      },
      data: {
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        projectId: data.projectId,
        dueDate: data.dueDate,
        assigneeId: data.assineeId,
      },
    })
  }

  public async delete(id: string) {
    return await this.prisma.task.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    })
  }
}
