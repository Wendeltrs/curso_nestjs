import { Test, TestingModule } from '@nestjs/testing'
import { mockPaginationQuery } from 'src/common/mocks/tests.mocks'
import { PrismaService } from 'src/common/services/prisma/prisma.service'
import { SessionService } from 'src/common/services/session/session.service'
import { ProjectsController } from './projects.controller'
import { mockedProjects, ProjectWithRelations } from './projects.mocks'
import { ProjectsModule } from './projects.module'
import { ProjectsService } from './projects.service'

describe('ProjectsController', () => {
  let controller: ProjectsController
  let service: ProjectsService
  const project = mockedProjects[0]

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ProjectsModule],
    })
      .overrideProvider(ProjectsService)
      .useValue(service)
      .overrideProvider(PrismaService)
      .useValue({ $connect: jest.fn() })
      .overrideProvider(SessionService)
      .useValue({ getUserId: jest.fn().mockResolvedValue('user-1') })
      .compile()

    controller = module.get<ProjectsController>(ProjectsController)
    service = module.get<ProjectsService>(ProjectsService)
  })

  describe('Get All Projects', () => {
    it('should be able to return a paginated list of projects', async () => {
      const mockPaginatedProjects: [ProjectWithRelations[], number] = [
        mockedProjects,
        mockedProjects.length,
      ]

      jest.spyOn(service, 'getAll').mockResolvedValue(mockPaginatedProjects)

      const result = await controller.getAll(mockPaginationQuery)

      expect(result).toEqual(mockPaginatedProjects)
      expect(service.getAll).toHaveBeenCalledTimes(1)
      expect(service.getAll).toHaveBeenCalledWith(mockPaginationQuery)
    })
  })

  describe('Get Project by Id', () => {
    it('should be able to return a project by id', async () => {
      jest.spyOn(service, 'get').mockResolvedValue(project)

      const result = await controller.get(project.id)

      expect(result).toEqual(project)
      expect(service.get).toHaveBeenCalledTimes(1)
      expect(service.get).toHaveBeenCalledWith(project.id)
    })
  })

  describe('Create Project', () => {
    it('should be able to create a new project', async () => {
      jest.spyOn(service, 'create').mockResolvedValue(project)

      const result = await controller.create({
        name: project.name,
        description: project.description as string,
      })

      expect(result).toEqual(project)
      expect(service.create).toHaveBeenCalledTimes(1)
      expect(service.create).toHaveBeenCalledWith({
        name: project.name,
        description: project.description as string,
      })
    })

    it('should be able to handle validation errors', async () => {
      const error = new Error('Name is required')

      jest.spyOn(service, 'create').mockRejectedValue(error) //O mockRejectedValue é usado quando a função retorna um erro

      await expect(controller.create({ name: '', description: '' })).rejects.toThrow(
        'Name is required',
      )
    })
  })

  describe('Update Project', () => {
    it('should be able to update a project', async () => {
      jest.spyOn(service, 'update').mockResolvedValue(project)

      const result = await controller.update(project.id, {
        name: project.name,
        description: project.description as string,
      })

      expect(result).toEqual(project)
      expect(service.update).toHaveBeenCalledTimes(1)
      expect(service.update).toHaveBeenCalledWith(project.id, {
        name: project.name,
        description: project.description as string,
      })
    })
  })

  describe('Delete Project', () => {
    it('should be able to delete a project', async () => {
      jest.spyOn(service, 'delete').mockImplementation() //O mockImplementation é usado quando a função não retorna dados

      await controller.delete(project.id)

      expect(service.delete).toHaveBeenCalledTimes(1)
      expect(service.delete).toHaveBeenCalledWith(project.id)
    })
  })
})
