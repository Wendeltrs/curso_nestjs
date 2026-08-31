import { Test, TestingModule } from '@nestjs/testing'
import { mockPaginationQuery } from 'src/common/mocks/tests.mocks'
import { PrismaService } from 'src/common/services/prisma/prisma.service'
import { SessionService } from 'src/common/services/session/session.service'
import { UsersController } from './users.controller'
import { mockedFile, mockedUsers } from './users.mocks'
import { UsersModule } from './users.module'
import { UsersService } from './users.service'

describe('UsersController', () => {
  let controller: UsersController
  let service: UsersService
  const user = mockedUsers[0]

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UsersModule],
    })
      .overrideProvider(UsersService)
      .useValue(service)
      .overrideProvider(PrismaService)
      .useValue({ $connect: jest.fn() })
      .overrideProvider(SessionService)
      .useValue({ getUserId: jest.fn().mockReturnValue('user-1') })
      .compile()

    controller = module.get<UsersController>(UsersController)
    service = module.get<UsersService>(UsersService)
  })

  describe('Get All Users', () => {
    it('should be able to return a paginated list of users', async () => {
      jest.spyOn(service, 'getAll').mockResolvedValue([mockedUsers, mockedUsers.length])

      const result = await controller.getAll(mockPaginationQuery)

      expect(result).toEqual([mockedUsers, mockedUsers.length])
      expect(service.getAll).toHaveBeenCalledWith(mockPaginationQuery)
      expect(service.getAll).toHaveBeenCalledTimes(1)
    })
  })

  describe('Get User by Id', () => {
    it('should be able to return a user by id', async () => {
      jest.spyOn(service, 'get').mockResolvedValue(user)

      const result = await controller.get(user.id)

      expect(result).toEqual(user)
      expect(service.get).toHaveBeenCalledWith(user.id)
      expect(service.get).toHaveBeenCalledTimes(1)
    })
  })

  describe('Get User by Email', () => {
    it('should be able to return a user by email', async () => {
      const mockedEmail = {
        email: user.email,
      }

      jest.spyOn(service, 'getEmail').mockResolvedValue(user)

      const result = await controller.getEmail(mockedEmail)

      expect(result).toEqual(user)
      expect(service.getEmail).toHaveBeenCalledWith(user.email)
      expect(service.getEmail).toHaveBeenCalledTimes(1)
    })
  })

  describe('Update User', () => {
    it('should be able to update a user', async () => {
      const mockedUpdateUser = {
        name: user.name,
        email: user.email,
      }

      jest.spyOn(service, 'update').mockResolvedValue(user)

      const result = await controller.update(user.id, mockedUpdateUser)

      expect(result).toEqual(user)
      expect(service.update).toHaveBeenCalledWith(user.id, mockedUpdateUser)
      expect(service.update).toHaveBeenCalledTimes(1)
    })
  })

  describe('Upload User Avatar', () => {
    it('should be able to upload a user avatar', async () => {
      jest.spyOn(service, 'uploadAvatar').mockResolvedValue(user)

      const result = await controller.uploadAvatar(mockedFile)

      expect(result).toEqual(user)
      expect(service.uploadAvatar).toHaveBeenCalledTimes(1)
      expect(service.uploadAvatar).toHaveBeenCalledWith(mockedFile)
    })
  })

  describe('Delete User', () => {
    it('should be able to delete a user', async () => {
      jest.spyOn(service, 'delete').mockImplementation()

      await controller.delete(user.id)

      expect(service.delete).toHaveBeenCalledWith(user.id)
      expect(service.delete).toHaveBeenCalledTimes(1)
    })
  })
})
