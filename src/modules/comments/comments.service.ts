import { Injectable, NotFoundException } from '@nestjs/common'
import { QueryDto } from 'src/common/decorators/query/query.decorator'
import { PrismaService } from 'src/common/services/prisma/prisma.service'
import { SessionService } from 'src/common/services/session/session.service'
import { CommentCreateDTO, CommentUpdateDTO } from './comments.dto'

@Injectable()
export class CommentsService {
  constructor(
    private readonly prisma: PrismaService,
    private session: SessionService,
  ) {}

  public async getAll(query?: QueryDto) {
    return await this.prisma.extensions.comment.findManyAndCount({
      skip: query?.skip,
      take: query?.take,
      orderBy: query?.orderBy,
      where: {
        ...query?.where,
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
        authorId: this.session.getUserId(),
        taskId: data.taskId,
      },
    })
  }

  public async update(id: string, data: CommentUpdateDTO) {
    const existingComment = await this.prisma.comment.findFirst({
      where: {
        id,
        authorId: this.session.getUserId(),
        deletedAt: null,
      },
    })

    if (!existingComment) {
      throw new NotFoundException('Comment not found')
    }

    return await this.prisma.comment.update({
      where: {
        id,
      },
      data: {
        content: data.content,
      },
    })
  }

  public async delete(id: string) {
    const existingComment = await this.prisma.comment.findFirst({
      where: {
        id,
        authorId: this.session.getUserId(),
        deletedAt: null,
      },
    })

    if (!existingComment) {
      throw new NotFoundException('Comment not found')
    }

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
