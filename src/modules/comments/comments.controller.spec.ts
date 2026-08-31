import { Test, TestingModule } from '@nestjs/testing'
import { mockPaginationQuery, validationError } from 'src/common/mocks/tests.mocks'
import { PrismaService } from 'src/common/services/prisma/prisma.service'
import { SessionService } from 'src/common/services/session/session.service'
import { CommentsController } from './comments.controller'
import { mockedComments, mockedCreateComment, mockedQueryComment } from './comments.mocks'
import { CommentsModule } from './comments.module'
import { CommentsService } from './comments.service'

describe('CommentsController', () => {
  let controller: CommentsController
  let service: CommentsService
  const comment = mockedComments[0]

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CommentsModule],
    })
      .overrideProvider(CommentsService)
      .useValue(service)
      .overrideProvider(PrismaService)
      .useValue({ $connect: jest.fn() })
      .overrideProvider(SessionService)
      .useValue({ getUserId: jest.fn().mockReturnValue('user-1') })
      .compile()

    controller = module.get<CommentsController>(CommentsController)
    service = module.get<CommentsService>(CommentsService)
  })

  describe('Get All Comments', () => {
    it('should be able to return a paginated list of comments', async () => {
      jest.spyOn(service, 'getAll').mockResolvedValue([mockedComments, mockedComments.length])

      const result = await controller.getAll(mockPaginationQuery, 'task-1')

      expect(result).toEqual([mockedComments, mockedComments.length])
      expect(service.getAll).toHaveBeenCalledTimes(1)
      expect(service.getAll).toHaveBeenCalledWith(mockedQueryComment)
    })
  })

  describe('Get Comment by Id', () => {
    it('should be able to return a comment by id', async () => {
      jest.spyOn(service, 'get').mockResolvedValue(comment)

      const result = await controller.get(comment.id, mockPaginationQuery, 'task-1')

      expect(result).toEqual(comment)
      expect(service.get).toHaveBeenCalledTimes(1)
      expect(service.get).toHaveBeenCalledWith(comment.id, mockedQueryComment)
    })
  })

  describe('Create Comment', () => {
    it('should be able to create a new comment', async () => {
      jest.spyOn(service, 'create').mockResolvedValue(comment)

      const result = await controller.create(mockedCreateComment)

      expect(result).toEqual(comment)
      expect(service.create).toHaveBeenCalledTimes(1)
      expect(service.create).toHaveBeenCalledWith(mockedCreateComment)
    })

    it('should be able to handle validation errors', async () => {
      jest.spyOn(service, 'create').mockRejectedValue(validationError)

      await expect(service.create({ content: '', taskId: '' })).rejects.toThrow(validationError)
    })
  })

  describe('Update Comment', () => {
    it('should be able to update a comment', async () => {
      jest.spyOn(service, 'update').mockResolvedValue(comment)

      const result = await controller.update(comment.id, { content: comment.content })

      expect(result).toEqual(comment)
      expect(service.update).toHaveBeenCalledTimes(1)
      expect(service.update).toHaveBeenCalledWith(comment.id, { content: comment.content })
    })
  })

  describe('Delete Comment', () => {
    it('should be able to delete a comment', async () => {
      jest.spyOn(service, 'delete').mockImplementation()

      await controller.delete(comment.id)

      expect(service.delete).toHaveBeenCalledTimes(1)
      expect(service.delete).toHaveBeenCalledWith(comment.id)
    })
  })
})
