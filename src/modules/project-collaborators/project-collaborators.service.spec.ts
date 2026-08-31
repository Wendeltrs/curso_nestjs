import { BadRequestException, NotFoundException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { mockedQueryForTaskAndCollaborator } from 'src/common/mocks/tests.mocks'
import { PrismaService } from 'src/common/services/prisma/prisma.service'
import { mockedProjects } from '../projects/projects.mocks'
import { mockedUsers } from '../users/users.mocks'
import { mockedCollaborators, mockedCreateCollaborator } from './project-collaborators.mocks'
import { ProjectCollaboratorsService } from './project-collaborators.service'

describe('ProjectCollaboratorsService', () => {
  let service: ProjectCollaboratorsService
  let prisma: PrismaService
  const collaborator = mockedCollaborators[0]

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectCollaboratorsService,
        {
          provide: PrismaService,
          useValue: {
            extensions: {
              projectCollaborator: {
                findManyAndCount: jest.fn(),
              },
            },
            projectCollaborator: {
              findFirst: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            project: {
              findFirst: jest.fn(),
            },
            user: {
              findFirst: jest.fn(),
            },
          },
        },
      ],
    }).compile()

    service = module.get<ProjectCollaboratorsService>(ProjectCollaboratorsService)
    prisma = module.get<PrismaService>(PrismaService)
  })

  describe('Get All Collaborators', () => {
    it('should be able to validate project id and return a paginated list of collaborators', async () => {
      jest.spyOn(prisma.project, 'findFirst').mockResolvedValue(mockedProjects[0])
      jest
        .spyOn(prisma.extensions.projectCollaborator, 'findManyAndCount')
        .mockResolvedValue([mockedCollaborators, mockedCollaborators.length])

      const result = await service.getAll(mockedQueryForTaskAndCollaborator)

      expect(result).toEqual([mockedCollaborators, mockedCollaborators.length])
      expect(prisma.extensions.projectCollaborator.findManyAndCount).toHaveBeenCalledTimes(1)
    })

    it('should be able to validate project id and throw an error if project not found', async () => {
      const error = new NotFoundException('Project not found')

      jest.spyOn(prisma.project, 'findFirst').mockRejectedValue(error)

      await expect(service.getAll(mockedQueryForTaskAndCollaborator)).rejects.toThrow(error)
      expect(prisma.project.findFirst).toHaveBeenCalledTimes(1)
    })
  })

  describe('Get Collaborator by Id', () => {
    it('should be able to validate project id and return a collaborator by id', async () => {
      jest.spyOn(prisma.project, 'findFirst').mockResolvedValue(mockedProjects[0])
      jest.spyOn(prisma.projectCollaborator, 'findFirst').mockResolvedValue(collaborator)

      const result = await service.get(collaborator.id, mockedQueryForTaskAndCollaborator)

      expect(result).toEqual(collaborator)
      expect(prisma.project.findFirst).toHaveBeenCalledTimes(1)
      expect(prisma.projectCollaborator.findFirst).toHaveBeenCalledTimes(1)
    })

    it('should be able to validate project id and throw an error if project not found', async () => {
      const error = new NotFoundException('Project not found')

      jest.spyOn(prisma.project, 'findFirst').mockRejectedValue(error)

      await expect(service.get(collaborator.id, mockedQueryForTaskAndCollaborator)).rejects.toThrow(
        error,
      )
      expect(prisma.project.findFirst).toHaveBeenCalledTimes(1)
    })
  })

  describe('Create Collaborator', () => {
    it('should be able to create a new collaborator', async () => {
      jest.spyOn(prisma.user, 'findFirst').mockResolvedValue(mockedUsers[0])
      jest.spyOn(prisma.project, 'findFirst').mockResolvedValue(mockedProjects[0])
      jest.spyOn(prisma.projectCollaborator, 'create').mockResolvedValue(collaborator)

      const result = await service.create(mockedCreateCollaborator)

      expect(result).toEqual(collaborator)
      expect(prisma.user.findFirst).toHaveBeenCalledTimes(1)
      expect(prisma.project.findFirst).toHaveBeenCalledTimes(1)
      expect(prisma.projectCollaborator.create).toHaveBeenCalledTimes(1)
    })

    it('should be able to validate user id and throw an error if user not found', async () => {
      const error = new NotFoundException('User not found')

      jest.spyOn(prisma.user, 'findFirst').mockRejectedValue(error)

      await expect(service.create(mockedCreateCollaborator)).rejects.toThrow(error)
      expect(prisma.user.findFirst).toHaveBeenCalledTimes(1)
    })

    it('should be able to validate project id and throw an error if project not found', async () => {
      const error = new NotFoundException('Project not found')

      jest.spyOn(prisma.user, 'findFirst').mockResolvedValue(mockedUsers[0])
      jest.spyOn(prisma.project, 'findFirst').mockRejectedValue(error)

      await expect(service.create(mockedCreateCollaborator)).rejects.toThrow(error)
      expect(prisma.user.findFirst).toHaveBeenCalledTimes(1)
      expect(prisma.project.findFirst).toHaveBeenCalledTimes(1)
    })
  })

  describe('Update Collaborator', () => {
    it('should be able to update a collaborator', async () => {
      jest.spyOn(prisma.projectCollaborator, 'update').mockResolvedValue(collaborator)

      const result = await service.update(collaborator.id, { role: 'VIEWER' })

      expect(result).toEqual(collaborator)
      expect(prisma.projectCollaborator.update).toHaveBeenCalledTimes(1)
    })
  })

  describe('Delete Collaborator', () => {
    it('should be able to validate owner role and delete a collaborator', async () => {
      jest.spyOn(prisma.projectCollaborator, 'findFirst').mockResolvedValue(null)
      jest.spyOn(prisma.projectCollaborator, 'update').mockImplementation()

      await service.delete(collaborator.id)

      expect(prisma.projectCollaborator.update).toHaveBeenCalledTimes(1)
    })

    it('should be able to validate owner role and throw an error if collaborator is owner', async () => {
      const error = new BadRequestException('Owner cannot be deleted')

      jest.spyOn(prisma.projectCollaborator, 'findFirst').mockRejectedValue(error)

      await expect(service.delete(collaborator.id)).rejects.toThrow(error)
      expect(prisma.projectCollaborator.findFirst).toHaveBeenCalledTimes(1)
    })
  })
})
