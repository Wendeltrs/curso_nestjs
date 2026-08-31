import { NotFoundException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { mockedQueryForTaskAndCollaborator } from 'src/common/mocks/tests.mocks'
import { PrismaService } from 'src/common/services/prisma/prisma.service'
import { SessionService } from 'src/common/services/session/session.service'
import { mockedProjects } from '../projects/projects.mocks'
import { mockedCreateAndUpdateTask, mockedTasks } from './tasks.mocks'
import { TasksService } from './tasks.service'

describe('TasksService', () => {
  let service: TasksService
  let prisma: PrismaService
  const task = mockedTasks[0]

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: PrismaService,
          useValue: {
            extensions: {
              task: {
                findManyAndCount: jest.fn(),
              },
            },
            task: {
              findFirst: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            project: {
              findFirst: jest.fn(),
            },
          },
        },
        {
          provide: SessionService,
          useValue: {
            getUserId: jest.fn().mockReturnValue('user-1'),
          },
        },
      ],
    }).compile()

    service = module.get<TasksService>(TasksService)
    prisma = module.get<PrismaService>(PrismaService)
  })

  describe('Get All Tasks', () => {
    it('should be able to validate project id and return a paginated list of tasks', async () => {
      jest.spyOn(prisma.project, 'findFirst').mockResolvedValue(mockedProjects[0])
      jest
        .spyOn(prisma.extensions.task, 'findManyAndCount')
        .mockResolvedValue([mockedTasks, mockedTasks.length])

      const result = await service.getAll(mockedQueryForTaskAndCollaborator)

      expect(result).toEqual([mockedTasks, mockedTasks.length])
      expect(prisma.extensions.task.findManyAndCount).toHaveBeenCalledTimes(1)
    })

    it('should be able to validate project id and throw an error if project not found', async () => {
      const error = new NotFoundException('Project not found')

      jest.spyOn(prisma.project, 'findFirst').mockRejectedValue(error)

      await expect(service.getAll(mockedQueryForTaskAndCollaborator)).rejects.toThrow(error)
      expect(prisma.project.findFirst).toHaveBeenCalledTimes(1)
    })
  })

  describe('Get Task by Id', () => {
    it('should be able to validate project id and return a task by id', async () => {
      jest.spyOn(prisma.project, 'findFirst').mockResolvedValue(mockedProjects[0])
      jest.spyOn(prisma.task, 'findFirst').mockResolvedValue(task)

      const result = await service.get(task.id, mockedQueryForTaskAndCollaborator)

      expect(result).toEqual(task)
      expect(prisma.project.findFirst).toHaveBeenCalledTimes(1)
      expect(prisma.task.findFirst).toHaveBeenCalledTimes(1)
    })

    it('should be able to validate project id and throw an error if project not found', async () => {
      const error = new NotFoundException('Project not found')

      jest.spyOn(prisma.project, 'findFirst').mockRejectedValue(error)

      await expect(service.get(task.id, mockedQueryForTaskAndCollaborator)).rejects.toThrow(error)
      expect(prisma.project.findFirst).toHaveBeenCalledTimes(1)
    })
  })

  it('should be able to create a new task', async () => {
    jest.spyOn(prisma.task, 'create').mockResolvedValue(task)

    const result = await service.create(mockedCreateAndUpdateTask)

    expect(result).toEqual(task)
    expect(prisma.task.create).toHaveBeenCalledTimes(1)
  })

  it('should be able to update a task', async () => {
    jest.spyOn(prisma.task, 'update').mockResolvedValue(task)

    const result = await service.update(task.id, mockedCreateAndUpdateTask)

    expect(result).toEqual(task)
    expect(prisma.task.update).toHaveBeenCalledTimes(1)
  })

  it('should be able to delete a task', async () => {
    jest.spyOn(prisma.task, 'update').mockImplementation()

    await service.delete(task.id)

    expect(prisma.task.update).toHaveBeenCalledTimes(1)
  })
})
