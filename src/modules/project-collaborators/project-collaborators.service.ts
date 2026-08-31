import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { CollaboratorRole } from '@prisma/client'
import { QueryDto } from 'src/common/decorators/query/query.decorator'
import { PrismaService } from 'src/common/services/prisma/prisma.service'
import {
  ProjectCollaboratorCreateDTO,
  ProjectCollaboratorUpdateDTO,
} from './project-collaborators.dto'

@Injectable()
export class ProjectCollaboratorsService {
  constructor(private prisma: PrismaService) {}

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

    return await this.prisma.extensions.projectCollaborator.findManyAndCount({
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
        user: true,
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

    return await this.prisma.projectCollaborator.findFirst({
      where: {
        id,
        projectId: project?.id,
        deletedAt: null,
      },
      include: {
        project: true,
        user: true,
      },
    })
  }

  public async create(data: ProjectCollaboratorCreateDTO) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: data.userId,
        deletedAt: null,
      },
    })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    const project = await this.prisma.project.findFirst({
      where: {
        id: data.projectId,
        deletedAt: null,
      },
    })

    if (!project) {
      throw new NotFoundException('Project not found')
    }

    return await this.prisma.projectCollaborator.create({
      data: {
        userId: user.id,
        projectId: project.id,
        role: data.role,
      },
    })
  }

  public async update(id: string, data: ProjectCollaboratorUpdateDTO) {
    return await this.prisma.projectCollaborator.update({
      where: {
        id,
      },
      data: {
        role: data.role,
      },
    })
  }

  public async delete(id: string) {
    const owner = await this.prisma.projectCollaborator.findFirst({
      where: {
        id,
        role: CollaboratorRole.OWNER,
        deletedAt: null,
      },
    })

    if (owner) {
      throw new BadRequestException('Owner cannot be deleted')
    }

    await this.prisma.projectCollaborator.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    })
  }
}
