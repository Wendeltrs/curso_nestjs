import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  NotFoundException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Observable } from 'rxjs'
import { PrismaService } from 'src/common/services/prisma/prisma.service'
import { VALIDATE_RESOURCES_IDS } from 'src/consts'

@Injectable()
export class ValidateResourcesIdsInterceptor implements NestInterceptor {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<Request>> {
    const shouldValidate = this.reflector.get<boolean>(VALIDATE_RESOURCES_IDS, context.getHandler())

    if (!shouldValidate) {
      return next.handle()
    }

    const request = context.switchToHttp().getRequest()
    const { projectId, taskId, userId, commentId, collaboratorId } = request.params

    if (projectId) {
      const project = await this.prisma.project.findFirst({
        where: {
          id: projectId,
          deletedAt: null,
        },
      })

      if (!project) {
        throw new NotFoundException('Project not found')
      }
    }

    if (taskId) {
      const task = await this.prisma.task.findFirst({
        where: {
          id: taskId,
          deletedAt: null,
        },
      })

      if (!task) {
        throw new NotFoundException('Task not found')
      }
    }

    if (userId) {
      const user = await this.prisma.user.findFirst({
        where: {
          id: userId,
          deletedAt: null,
        },
      })

      if (!user) {
        throw new NotFoundException('User not found')
      }
    }

    if (commentId) {
      const comment = await this.prisma.comment.findFirst({
        where: {
          id: commentId,
          deletedAt: null,
        },
      })

      if (!comment) {
        throw new NotFoundException('Comment not found')
      }
    }

    if (collaboratorId) {
      const collaborator = await this.prisma.projectCollaborator.findFirst({
        where: {
          id: collaboratorId,
          deletedAt: null,
        },
      })

      if (!collaborator) {
        throw new NotFoundException('Collaborator not found')
      }
    }

    return next.handle()
  }
}
