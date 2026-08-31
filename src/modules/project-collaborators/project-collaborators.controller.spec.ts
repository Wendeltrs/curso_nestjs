import { Test, TestingModule } from '@nestjs/testing'
import {
  mockedQueryForTaskAndCollaborator,
  mockPaginationQuery,
  validationError,
} from 'src/common/mocks/tests.mocks'
import { PrismaService } from 'src/common/services/prisma/prisma.service'
import { SessionService } from 'src/common/services/session/session.service'
import { ProjectCollaboratorsController } from './project-collaborators.controller'
import { mockedCollaborators, mockedCreateCollaborator } from './project-collaborators.mocks'
import { ProjectCollaboratorsModule } from './project-collaborators.module'
import { ProjectCollaboratorsService } from './project-collaborators.service'

describe('ProjectCollaboratorsController', () => {
  let controller: ProjectCollaboratorsController
  let service: ProjectCollaboratorsService
  const collaborator = mockedCollaborators[0]

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ProjectCollaboratorsModule],
    })
      .overrideProvider(ProjectCollaboratorsService)
      .useValue(service)
      .overrideProvider(PrismaService)
      .useValue({ $connect: jest.fn() })
      .overrideProvider(SessionService)
      .useValue({ getUserId: jest.fn().mockReturnValue('user-1') })
      .compile()

    controller = module.get<ProjectCollaboratorsController>(ProjectCollaboratorsController)
    service = module.get<ProjectCollaboratorsService>(ProjectCollaboratorsService)
  })

  describe('Get All Collaborators', () => {
    it('should be able to return a paginated list of collaborators', async () => {
      jest
        .spyOn(service, 'getAll')
        .mockResolvedValue([mockedCollaborators, mockedCollaborators.length])

      const result = await controller.getAll(mockPaginationQuery, 'project-1')

      expect(result).toEqual([mockedCollaborators, mockedCollaborators.length])
      expect(service.getAll).toHaveBeenCalledTimes(1)
      expect(service.getAll).toHaveBeenCalledWith(mockedQueryForTaskAndCollaborator)
    })
  })

  describe('Get Collaborator by Id', () => {
    it('should be able to return a collaborator by id', async () => {
      jest.spyOn(service, 'get').mockResolvedValue(collaborator)

      const result = await controller.get(collaborator.id, mockPaginationQuery, 'project-1')

      expect(result).toEqual(collaborator)
      expect(service.get).toHaveBeenCalledTimes(1)
      expect(service.get).toHaveBeenCalledWith(collaborator.id, mockedQueryForTaskAndCollaborator)
    })
  })

  describe('Create Collaborator', () => {
    it('should be able to create a new collaborator', async () => {
      jest.spyOn(service, 'create').mockResolvedValue(collaborator)

      const result = await controller.create(mockedCreateCollaborator)

      expect(result).toEqual(collaborator)
      expect(service.create).toHaveBeenCalledTimes(1)
      expect(service.create).toHaveBeenCalledWith(mockedCreateCollaborator)
    })

    it('should be able to handle validation errors', async () => {
      jest.spyOn(service, 'create').mockRejectedValue(validationError)

      await expect(controller.create({ projectId: '', userId: '' })).rejects.toThrow(
        validationError,
      )
    })
  })

  describe('Update Collaborator', () => {
    it('should be able to update a collaborator', async () => {
      jest.spyOn(service, 'update').mockResolvedValue(collaborator)

      const result = await controller.update(collaborator.id, { role: 'VIEWER' })

      expect(result).toEqual(collaborator)
      expect(service.update).toHaveBeenCalledTimes(1)
      expect(service.update).toHaveBeenCalledWith(collaborator.id, { role: 'VIEWER' })
    })
  })

  describe('Delete Collaborator', () => {
    it('should be able to delete a collaborator', async () => {
      jest.spyOn(service, 'delete').mockImplementation()

      await controller.delete(collaborator.id)

      expect(service.delete).toHaveBeenCalledTimes(1)
      expect(service.delete).toHaveBeenCalledWith(collaborator.id)
    })
  })
})
