import { Test, TestingModule } from '@nestjs/testing'
import {
  mockedQueryForTaskAndCollaborator,
  mockPaginationQuery,
  validationError,
} from 'src/common/mocks/tests.mocks'
import { PrismaService } from 'src/common/services/prisma/prisma.service'
import { SessionService } from 'src/common/services/session/session.service'
import { TasksController } from './tasks.controller'
import { mockedCreateAndUpdateTask, mockedTasks } from './tasks.mocks'
import { TasksModule } from './tasks.module'
import { TasksService } from './tasks.service'

describe('TasksController', () => {
  let controller: TasksController
  let service: TasksService
  const task = mockedTasks[0]

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TasksModule],
    })
      .overrideProvider(TasksService)
      .useValue(service)
      .overrideProvider(PrismaService)
      .useValue({ $connect: jest.fn() })
      .overrideProvider(SessionService)
      .useValue({ getUserId: jest.fn().mockReturnValue('user-1') })
      .compile()

    controller = module.get<TasksController>(TasksController)
    service = module.get<TasksService>(TasksService)
  })

  describe('Get All Tasks', () => {
    it('should be able to return a paginated list of tasks', async () => {
      jest.spyOn(service, 'getAll').mockResolvedValue([mockedTasks, mockedTasks.length])

      const result = await controller.getAll(mockPaginationQuery, 'project-1')

      expect(result).toEqual([mockedTasks, mockedTasks.length])
      expect(service.getAll).toHaveBeenCalledTimes(1)
      expect(service.getAll).toHaveBeenCalledWith(mockedQueryForTaskAndCollaborator)
    })
  })

  describe('Get Task by Id', () => {
    it('should be able to return a task', async () => {
      jest.spyOn(service, 'get').mockResolvedValue(task)

      const result = await controller.get(task.id, mockPaginationQuery, 'project-1')

      expect(result).toEqual(task)
      expect(service.get).toHaveBeenCalledTimes(1)
      expect(service.get).toHaveBeenCalledWith(task.id, mockedQueryForTaskAndCollaborator)
    })
  })

  describe('Create Task', () => {
    it('should be able to create a new task', async () => {
      jest.spyOn(service, 'create').mockResolvedValue(task)

      const result = await controller.create(mockedCreateAndUpdateTask)

      expect(result).toEqual(task)
      expect(service.create).toHaveBeenCalledTimes(1)
      expect(service.create).toHaveBeenCalledWith(mockedCreateAndUpdateTask)
    })

    it('should be able to handle validation errors', async () => {
      jest.spyOn(service, 'create').mockRejectedValue(validationError)

      await expect(controller.create({ title: '', projectId: '' })).rejects.toThrow(validationError)
    })
  })

  describe('Update Task', () => {
    it('should be able to update a task', async () => {
      jest.spyOn(service, 'update').mockResolvedValue(task)

      const result = await controller.update(task.id, mockedCreateAndUpdateTask)

      expect(result).toEqual(task)
      expect(service.update).toHaveBeenCalledTimes(1)
      expect(service.update).toHaveBeenCalledWith(task.id, mockedCreateAndUpdateTask)
    })
  })

  describe('Delete Task', () => {
    it('should be able to delete a task', async () => {
      jest.spyOn(service, 'delete').mockImplementation()

      await controller.delete(task.id)

      expect(service.delete).toHaveBeenCalledTimes(1)
      expect(service.delete).toHaveBeenCalledWith(task.id)
    })
  })
})
