import { Injectable } from '@nestjs/common'
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
    return await this.prisma.task.findFirst({
      where: {
        id,
        ...query.where,
        deletedAt: null,
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
