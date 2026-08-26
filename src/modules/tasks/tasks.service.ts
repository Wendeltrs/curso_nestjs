import { Injectable, NotFoundException } from '@nestjs/common'
import { QueryDto } from 'src/common/decorators/query/query.decorator'
import { PrismaService } from 'src/common/services/prisma/prisma.service'
import { SessionService } from 'src/common/services/session/session.service'
import { TaskCreateDTO, TaskUpdateDTO } from './tasks.dto'

@Injectable()
export class TasksService {
  constructor(
    private prisma: PrismaService,
    private session: SessionService,
  ) {}

  public async getAll(query?: QueryDto & { projectId: string }) {
    const project = await this.prisma.project.findFirst({
      where: {
        id: query?.projectId,
        deletedAt: null,
      },
    })

    if (!project) {
      throw new NotFoundException('Project not found')
    }

    return await this.prisma.extensions.task.findManyAndCount({
      skip: query?.skip,
      take: query?.take,
      orderBy: query?.orderBy,
      where: {
        ...query?.where,
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

  public async get(id: string, query?: QueryDto & { projectId: string }) {
    const project = await this.prisma.project.findFirst({
      where: {
        id: query?.projectId,
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
        assigneeId: this.session.getUserId(),
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
