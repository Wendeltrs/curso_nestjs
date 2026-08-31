import { NotFoundException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { mockPaginationQuery } from 'src/common/mocks/tests.mocks'
import { CloudinaryService } from 'src/common/services/cloudinary/cloudinary.service'
import { PrismaService } from 'src/common/services/prisma/prisma.service'
import { SessionService } from 'src/common/services/session/session.service'
import { mockedFile, mockedUsers } from './users.mocks'
import { UsersService } from './users.service'

describe('UsersService', () => {
  let service: UsersService
  let prisma: PrismaService
  let session: SessionService
  let cloudinary: CloudinaryService
  const user = mockedUsers[0]

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            extensions: {
              user: {
                findManyAndCount: jest.fn(),
              },
            },
            user: {
              findFirst: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
        {
          provide: SessionService,
          useValue: {
            getUserId: jest.fn().mockResolvedValue('user-1'),
          },
        },
        {
          provide: CloudinaryService,
          useValue: {
            upload: jest.fn(),
          },
        },
      ],
    }).compile()

    service = module.get<UsersService>(UsersService)
    prisma = module.get<PrismaService>(PrismaService)
    session = module.get<SessionService>(SessionService)
    cloudinary = module.get<CloudinaryService>(CloudinaryService)
  })

  describe('User Service', () => {
    it('should be able to return a paginated list of users', async () => {
      jest
        .spyOn(prisma.extensions.user, 'findManyAndCount')
        .mockResolvedValue([mockedUsers, mockedUsers.length])

      const result = await service.getAll(mockPaginationQuery)

      expect(result).toEqual([mockedUsers, mockedUsers.length])
      expect(prisma.extensions.user.findManyAndCount).toHaveBeenCalledTimes(1)
    })

    it('should be able to return a user by id', async () => {
      jest.spyOn(prisma.user, 'findFirst').mockResolvedValue(user)

      const result = await service.get(user.id)

      expect(result).toEqual(user)
      expect(prisma.user.findFirst).toHaveBeenCalledTimes(1)
    })
  })

  it('should be able to return a user by email', async () => {
    jest.spyOn(prisma.user, 'findFirst').mockResolvedValue(user)

    const result = await service.getEmail(user.email)

    expect(result).toEqual(user)
    expect(prisma.user.findFirst).toHaveBeenCalledTimes(1)
  })

  it('should be able to validate a user and throw an error if email does not exist', async () => {
    const error = new NotFoundException('User not found')

    jest.spyOn(prisma.user, 'findFirst').mockRejectedValue(error)

    await expect(service.getEmail(user.email)).rejects.toThrow(error)
    expect(prisma.user.findFirst).toHaveBeenCalledTimes(1)
  })

  it('should be able to create a new user', async () => {
    jest.spyOn(prisma.user, 'create').mockResolvedValue(user)

    const result = await service.create({
      name: user.name,
      email: user.email,
      password: user.password,
    })

    expect(result).toEqual(user)
    expect(prisma.user.create).toHaveBeenCalledTimes(1)
  })

  it('should be able to update a user', async () => {
    jest.spyOn(prisma.user, 'update').mockResolvedValue(user)

    const result = await service.update(user.id, {
      name: user.name,
      email: user.email,
    })

    expect(result).toEqual(user)
    expect(prisma.user.update).toHaveBeenCalledTimes(1)
  })

  it('should be able to update a user avatar', async () => {
    jest.spyOn(prisma.user, 'update').mockResolvedValue(user)
    jest.spyOn(session, 'getUserId').mockReturnValue(user.id)
    jest.spyOn(cloudinary, 'upload').mockResolvedValue({ url: 'url' })

    const resultCloudinary = await cloudinary.upload(mockedFile, user.id)
    const result = await service.uploadAvatar(mockedFile)

    expect(result).toEqual(user)
    expect(resultCloudinary.url).toEqual('url')
    expect(prisma.user.update).toHaveBeenCalledTimes(1)
  })

  it('should be able to delete a user', async () => {
    jest.spyOn(prisma.user, 'update').mockImplementation()

    await service.delete(user.id)

    expect(prisma.user.update).toHaveBeenCalledTimes(1)
  })
})
