import { NotFoundException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from 'src/common/services/prisma/prisma.service'
import { SessionService } from 'src/common/services/session/session.service'
import { mockedTasks } from '../tasks/tasks.mocks'
import { mockedComments, mockedCreateComment, mockedQueryComment } from './comments.mocks'
import { CommentsService } from './comments.service'

describe('CommentsService', () => {
  let service: CommentsService
  let prisma: PrismaService
  const comment = mockedComments[0]

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        {
          provide: PrismaService,
          useValue: {
            extensions: {
              comment: {
                findManyAndCount: jest.fn(),
              },
            },
            comment: {
              findFirst: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            task: {
              findFirst: jest.fn(),
            },
          },
        },
        {
          provide: SessionService,
          useValue: {
            getUserId: jest.fn(),
          },
        },
      ],
    }).compile()

    service = module.get<CommentsService>(CommentsService)
    prisma = module.get<PrismaService>(PrismaService)
  })

  describe('Get All Comments', () => {
    it('should be able to validate task id and return a paginated list of comments', async () => {
      jest.spyOn(prisma.task, 'findFirst').mockResolvedValue(mockedTasks[0])
      jest
        .spyOn(prisma.extensions.comment, 'findManyAndCount')
        .mockResolvedValue([mockedComments, mockedComments.length])

      const result = await service.getAll(mockedQueryComment)

      expect(result).toEqual([mockedComments, mockedComments.length])
      expect(prisma.task.findFirst).toHaveBeenCalledTimes(1)
      expect(prisma.extensions.comment.findManyAndCount).toHaveBeenCalledTimes(1)
    })

    it('should be able to validate task id and throw an error if task not found', async () => {
      const error = new NotFoundException('Task not found')

      jest.spyOn(prisma.task, 'findFirst').mockRejectedValue(error)

      await expect(service.getAll(mockedQueryComment)).rejects.toThrow(error)
      expect(prisma.task.findFirst).toHaveBeenCalledTimes(1)
    })
  })

  describe('Get Comment by Id', () => {
    it('should be able to validate task id and return a comment by id', async () => {
      jest.spyOn(prisma.task, 'findFirst').mockResolvedValue(mockedTasks[0])
      jest.spyOn(prisma.comment, 'findFirst').mockResolvedValue(comment)

      const result = await service.get(comment.id, mockedQueryComment)

      expect(result).toEqual(comment)
      expect(prisma.task.findFirst).toHaveBeenCalledTimes(1)
      expect(prisma.comment.findFirst).toHaveBeenCalledTimes(1)
    })

    it('should be able to validate task id and throw an error if task not found', async () => {
      const error = new NotFoundException('Task not found')

      jest.spyOn(prisma.task, 'findFirst').mockRejectedValue(error)

      await expect(service.get(comment.id, mockedQueryComment)).rejects.toThrow(error)
      expect(prisma.task.findFirst).toHaveBeenCalledTimes(1)
    })
  })

  describe('Create Comment', () => {
    it('should be able to create a new comment', async () => {
      jest.spyOn(prisma.comment, 'create').mockResolvedValue(comment)

      const result = await service.create(mockedCreateComment)

      expect(result).toEqual(comment)
      expect(prisma.comment.create).toHaveBeenCalledTimes(1)
    })
  })

  describe('Update Comment', () => {
    it('should be able to update a comment', async () => {
      jest.spyOn(prisma.comment, 'update').mockResolvedValue(comment)

      const result = await service.update(comment.id, { content: comment.content })

      expect(result).toEqual(comment)
      expect(prisma.comment.update).toHaveBeenCalledTimes(1)
    })
  })

  describe('Delete Comment', () => {
    it('should be able to delete a comment', async () => {
      jest.spyOn(prisma.comment, 'update').mockImplementation()

      await service.delete(comment.id)

      expect(prisma.comment.update).toHaveBeenCalledTimes(1)
    })
  })
})
