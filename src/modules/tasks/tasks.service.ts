import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { QueryDto } from 'src/services/query/query.decorator'
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
    })
  }

  public async get(id: string, query: QueryDto) {
    const task = await this.prisma.task.findFirst({
      where: {
        id,
        ...query.where,
        deletedAt: null,
      },
    })

    if (!task) {
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND)
    }

    return task
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
      },
    })
  }

  public async update(id: string, data: TaskUpdateDTO) {
    const task = await this.prisma.task.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    })

    if (!task) {
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND)
    }

    return await this.prisma.task.update({
      where: {
        id: task.id,
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
    const task = await this.prisma.task.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    })

    if (!task) {
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND)
    }

    return await this.prisma.task.update({
      where: {
        id: task.id,
      },
      data: {
        deletedAt: new Date(),
      },
    })
  }
}
