import { Test, TestingModule } from '@nestjs/testing'
import { mockPaginationQuery } from 'src/common/mocks/tests.mocks'
import { PrismaService } from 'src/common/services/prisma/prisma.service'
import { SessionService } from 'src/common/services/session/session.service'
import { mockedProjects } from './projects.mocks'
import { ProjectsService } from './projects.service'

describe('ProjectsService', () => {
  let service: ProjectsService
  let prisma: PrismaService
  const project = mockedProjects[0]

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        {
          provide: PrismaService,
          useValue: {
            extensions: {
              project: {
                findManyAndCount: jest.fn(),
              },
            },
            project: {
              findFirst: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            projectCollaborator: {
              create: jest.fn(),
            },
            task: {
              updateMany: jest.fn(),
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

    service = module.get<ProjectsService>(ProjectsService)
    prisma = module.get<PrismaService>(PrismaService)
  })

  describe('Project Service', () => {
    it('should be able to return a paginated list of projects', async () => {
      jest
        .spyOn(prisma.extensions.project, 'findManyAndCount')
        .mockResolvedValue([mockedProjects, mockedProjects.length])

      const result = await service.getAll(mockPaginationQuery)

      expect(result).toEqual([mockedProjects, mockedProjects.length])
      expect(prisma.extensions.project.findManyAndCount).toHaveBeenCalledTimes(1)
    })

    it('should be able to return a project by id', async () => {
      jest.spyOn(prisma.project, 'findFirst').mockResolvedValue(project)

      const result = await service.get(project.id)

      expect(result).toEqual(project)
      expect(prisma.project.findFirst).toHaveBeenCalledTimes(1)
    })

    it('should be able to create a new project', async () => {
      jest.spyOn(prisma.project, 'create').mockResolvedValue(project)

      const result = await service.create({
        name: project.name,
        description: project.description as string,
      })

      expect(result).toEqual(project)
      expect(prisma.project.create).toHaveBeenCalledTimes(1)
    })

    it('should be able to update a project', async () => {
      jest.spyOn(prisma.project, 'update').mockResolvedValue(project)

      const result = await service.update(project.id, {
        name: project.name,
        description: project.description as string,
      })

      expect(result).toEqual(project)
      expect(prisma.project.update).toHaveBeenCalledTimes(1)
    })

    it('should be able to delete a project', async () => {
      jest.spyOn(prisma.task, 'updateMany').mockImplementation()
      jest.spyOn(prisma.project, 'update').mockImplementation()

      await service.delete(project.id)

      expect(prisma.task.updateMany).toHaveBeenCalledTimes(1)
      expect(prisma.project.update).toHaveBeenCalledTimes(1)
    })
  })
})
