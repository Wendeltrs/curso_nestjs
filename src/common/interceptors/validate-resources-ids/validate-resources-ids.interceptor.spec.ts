import { NotFoundException } from '@nestjs/common'
import { HttpArgumentsHost } from '@nestjs/common/interfaces'
import { Reflector } from '@nestjs/core'
import { Test, TestingModule } from '@nestjs/testing'
import { mockedCallHandler, mockedExecutionContext } from 'src/common/mocks/tests.mocks'
import { PrismaService } from 'src/common/services/prisma/prisma.service'
import { SessionService } from 'src/common/services/session/session.service'
import { VALIDATE_RESOURCES_IDS } from 'src/consts'
import { ValidateResourcesIdsInterceptor } from './validate-resources-ids.interceptor'

describe('ValidateResourcesIdsInterceptor', () => {
  let interceptor: ValidateResourcesIdsInterceptor
  let reflector: Reflector
  let prisma: PrismaService

  const mockRequestProject = {
    params: {
      projectId: 'project-1',
    },
  }

  const mockRequestTask = {
    params: {
      taskId: 'task-1',
    },
  }

  const mockRequestUser = {
    params: {
      userId: 'user-1',
    },
  }

  const mockRequestComment = {
    params: {
      commentId: 'comment-1',
    },
  }

  const mockRequestCollaborator = {
    params: {
      collaboratorId: 'collaborator-1',
    },
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ValidateResourcesIdsInterceptor,
        {
          provide: Reflector,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            project: {
              findFirst: jest.fn(),
            },
            task: {
              findFirst: jest.fn(),
            },
            user: {
              findFirst: jest.fn(),
            },
            comment: {
              findFirst: jest.fn(),
            },
            projectCollaborator: {
              findFirst: jest.fn(),
            },
          },
        },
        {
          provide: SessionService,
          useValue: { getUserId: jest.fn().mockReturnValue('user-1') },
        },
      ],
    }).compile()

    interceptor = module.get<ValidateResourcesIdsInterceptor>(ValidateResourcesIdsInterceptor)
    reflector = module.get<Reflector>(Reflector)
    prisma = module.get<PrismaService>(PrismaService)
  })

  it('should skip validation if decorator is not present', async () => {
    jest.spyOn(reflector, 'get').mockReturnValue(false) //mockReturnValue: usado quando a função não retorna uma Promisse

    const result = await interceptor.intercept(mockedExecutionContext, mockedCallHandler)

    expect(reflector.get).toHaveBeenCalledWith(
      VALIDATE_RESOURCES_IDS,
      mockedExecutionContext.getHandler(),
    )
    expect(result).toBeDefined() //toBeDefined: espera que result tenha valor
    expect(prisma.project.findFirst).not.toHaveBeenCalled()
    expect(prisma.task.findFirst).not.toHaveBeenCalled()
    expect(prisma.user.findFirst).not.toHaveBeenCalled()
    expect(prisma.comment.findFirst).not.toHaveBeenCalled()
    expect(prisma.projectCollaborator.findFirst).not.toHaveBeenCalled()
  })

  it('should validate project id and throw if project not found', async () => {
    jest.spyOn(reflector, 'get').mockReturnValue(true)
    jest
      .spyOn(mockedExecutionContext, 'switchToHttp')
      .mockReturnValue({ getRequest: () => mockRequestProject } as HttpArgumentsHost)
    jest.spyOn(prisma.project, 'findFirst').mockResolvedValue(null) //mockResolvedValue: usado quando a função retorna uma Promisse

    await expect(interceptor.intercept(mockedExecutionContext, mockedCallHandler)).rejects.toThrow(
      new NotFoundException('Project not found'),
    )
    expect(prisma.project.findFirst).toHaveBeenCalledWith({
      where: {
        id: 'project-1',
        deletedAt: null,
      },
    })
  })

  it('should validate project id and continue if project exist', async () => {
    jest.spyOn(reflector, 'get').mockReturnValue(true)
    jest.spyOn(mockedExecutionContext, 'switchToHttp').mockReturnValue({
      getRequest: () => mockRequestProject,
    } as HttpArgumentsHost)
    jest.spyOn(prisma.project, 'findFirst').mockResolvedValue({ id: 'project-1' } as any)

    const result = await interceptor.intercept(mockedExecutionContext, mockedCallHandler)

    expect(result).toBeDefined()
    expect(prisma.project.findFirst).toHaveBeenCalledWith({
      where: {
        id: 'project-1',
        deletedAt: null,
      },
    })
  })

  it('should validate task id and throw if task not found', async () => {
    jest.spyOn(reflector, 'get').mockReturnValue(true)
    jest.spyOn(mockedExecutionContext, 'switchToHttp').mockReturnValue({
      getRequest: () => mockRequestTask,
    } as HttpArgumentsHost)
    jest.spyOn(prisma.task, 'findFirst').mockResolvedValue(null)

    await expect(interceptor.intercept(mockedExecutionContext, mockedCallHandler)).rejects.toThrow(
      new NotFoundException('Task not found'),
    )
    expect(prisma.task.findFirst).toHaveBeenCalledWith({
      where: {
        id: 'task-1',
        deletedAt: null,
      },
    })
  })

  it('should validate task id and continue if task exist', async () => {
    jest.spyOn(reflector, 'get').mockReturnValue(true)
    jest.spyOn(mockedExecutionContext, 'switchToHttp').mockReturnValue({
      getRequest: () => mockRequestTask,
    } as HttpArgumentsHost)
    jest.spyOn(prisma.task, 'findFirst').mockResolvedValue({ id: 'task-1' } as any)

    const result = await interceptor.intercept(mockedExecutionContext, mockedCallHandler)

    expect(result).toBeDefined()
    expect(prisma.task.findFirst).toHaveBeenCalledWith({
      where: {
        id: 'task-1',
        deletedAt: null,
      },
    })
  })

  it('should validate user id and throw if user not found', async () => {
    jest.spyOn(reflector, 'get').mockReturnValue(true)
    jest.spyOn(mockedExecutionContext, 'switchToHttp').mockReturnValue({
      getRequest: () => mockRequestUser,
    } as HttpArgumentsHost)
    jest.spyOn(prisma.user, 'findFirst').mockResolvedValue(null)

    await expect(interceptor.intercept(mockedExecutionContext, mockedCallHandler)).rejects.toThrow(
      new NotFoundException('User not found'),
    )
    expect(prisma.user.findFirst).toHaveBeenCalledWith({
      where: {
        id: 'user-1',
        deletedAt: null,
      },
    })
  })

  it('should validate user id and continue if user exist', async () => {
    jest.spyOn(reflector, 'get').mockReturnValue(true)
    jest.spyOn(mockedExecutionContext, 'switchToHttp').mockReturnValue({
      getRequest: () => mockRequestUser,
    } as HttpArgumentsHost)
    jest.spyOn(prisma.user, 'findFirst').mockResolvedValue({ id: 'user-1' } as any)

    const result = await interceptor.intercept(mockedExecutionContext, mockedCallHandler)

    expect(result).toBeDefined()
    expect(prisma.user.findFirst).toHaveBeenCalledWith({
      where: {
        id: 'user-1',
        deletedAt: null,
      },
    })
  })

  it('should validate comment id and throw if comment not found', async () => {
    jest.spyOn(reflector, 'get').mockReturnValue(true)
    jest.spyOn(mockedExecutionContext, 'switchToHttp').mockReturnValue({
      getRequest: () => mockRequestComment,
    } as HttpArgumentsHost)

    await expect(interceptor.intercept(mockedExecutionContext, mockedCallHandler)).rejects.toThrow(
      new NotFoundException('Comment not found'),
    )
    expect(prisma.comment.findFirst).toHaveBeenCalledWith({
      where: {
        id: 'comment-1',
        authorId: 'user-1',
        deletedAt: null,
      },
    })
  })

  it('should validate comment id and continue if comment exist', async () => {
    jest.spyOn(reflector, 'get').mockReturnValue(true)
    jest.spyOn(mockedExecutionContext, 'switchToHttp').mockReturnValue({
      getRequest: () => mockRequestComment,
    } as HttpArgumentsHost)
    jest.spyOn(prisma.comment, 'findFirst').mockResolvedValue({ id: 'comment-1' } as any)

    const result = await interceptor.intercept(mockedExecutionContext, mockedCallHandler)

    expect(result).toBeDefined()
    expect(prisma.comment.findFirst).toHaveBeenCalledWith({
      where: {
        id: 'comment-1',
        authorId: 'user-1',
        deletedAt: null,
      },
    })
  })

  it('should validate collaborator id and throw if collaborator not found', async () => {
    jest.spyOn(reflector, 'get').mockReturnValue(true)
    jest.spyOn(mockedExecutionContext, 'switchToHttp').mockReturnValue({
      getRequest: () => mockRequestCollaborator,
    } as HttpArgumentsHost)
    jest.spyOn(prisma.projectCollaborator, 'findFirst').mockResolvedValue(null)

    await expect(interceptor.intercept(mockedExecutionContext, mockedCallHandler)).rejects.toThrow(
      new NotFoundException('Collaborator not found'),
    )
    expect(prisma.projectCollaborator.findFirst).toHaveBeenCalledWith({
      where: {
        id: 'collaborator-1',
        deletedAt: null,
      },
    })
  })

  it('should validate collaborator id and continue if collaborator exist', async () => {
    jest.spyOn(reflector, 'get').mockReturnValue(true)
    jest.spyOn(mockedExecutionContext, 'switchToHttp').mockReturnValue({
      getRequest: () => mockRequestCollaborator,
    } as HttpArgumentsHost)
    jest
      .spyOn(prisma.projectCollaborator, 'findFirst')
      .mockResolvedValue({ id: 'collaborator-1' } as any)

    const result = await interceptor.intercept(mockedExecutionContext, mockedCallHandler)

    expect(result).toBeDefined()
    expect(prisma.projectCollaborator.findFirst).toHaveBeenCalledWith({
      where: {
        id: 'collaborator-1',
        deletedAt: null,
      },
    })
  })
})
