import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { QueryDto } from 'src/services/query/query.decorator'
import { CommentCreateDTO, CommentUpdateDTO } from './comments.dto'

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  public async getAll(query: QueryDto) {
    return await this.prisma.comment.findMany({
      skip: query?.skip,
      take: query?.take,
      orderBy: query?.orderBy,
      where: {
        ...query.where,
        deletedAt: null,
      },
      include: {
        author: true,
        task: true,
      },
    })
  }

  public async get(id: string, query: QueryDto) {
    const task = await this.prisma.task.findFirst({
      where: {
        id: query?.where?.taskId,
        deletedAt: null,
      },
    })

    if (!task) {
      throw new NotFoundException('Task not found')
    }

    return await this.prisma.comment.findFirst({
      where: {
        id,
        taskId: task?.id,
        deletedAt: null,
      },
      include: {
        author: true,
        task: true,
      },
    })
  }

  public async create(data: CommentCreateDTO) {
    return await this.prisma.comment.create({
      data: {
        content: data.content,
        authorId: data.authorId,
        taskId: data.taskId,
      },
    })
  }

  public async update(id: string, data: CommentUpdateDTO) {
    return await this.prisma.comment.update({
      where: {
        id,
      },
      data: {
        content: data.content,
        authorId: data.authorId,
        taskId: data.taskId,
      },
    })
  }

  public async delete(id: string) {
    return await this.prisma.comment.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    })
  }
}
