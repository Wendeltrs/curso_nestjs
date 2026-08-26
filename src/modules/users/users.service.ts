import { Injectable } from '@nestjs/common'
import { QueryDto } from 'src/common/decorators/query/query.decorator'
import { CloudinaryService } from 'src/common/services/cloudinary/cloudinary.service'
import { PrismaService } from 'src/common/services/prisma/prisma.service'
import { SessionService } from 'src/common/services/session/session.service'
import { UserCreateDTO, UserUpdateDTO } from './users.dto'

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private session: SessionService,
    private cloudinary: CloudinaryService,
  ) {}

  public async getAll(query?: QueryDto) {
    return await this.prisma.extensions.user.findManyAndCount({
      skip: query?.skip,
      take: query?.take,
      orderBy: query?.orderBy,
      where: {
        ...query?.where,
        deletedAt: null,
      },
      include: {
        projects: true,
        collaborations: true,
        comments: true,
        tasksAssigned: true,
      },
    })
  }

  public async get(id: string) {
    return await this.prisma.user.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        projects: true,
        collaborations: true,
        comments: true,
        tasksAssigned: true,
      },
    })
  }

  public async getEmail(email: string) {
    return await this.prisma.user.findFirst({
      where: {
        email,
        deletedAt: null,
      },
      include: {
        projects: true,
        collaborations: true,
        comments: true,
        tasksAssigned: true,
      },
    })
  }

  public async create(data: UserCreateDTO) {
    return await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        role: data.role,
        password: data.password,
      },
    })
  }

  public async update(id: string, data: UserUpdateDTO) {
    return await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        name: data.name,
        email: data.email,
      },
    })
  }

  public async uploadAvatar(file: Express.Multer.File) {
    const userId = this.session.userId
    const result = await this.cloudinary.upload(file, userId)

    return await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        avatar: result.url,
      },
    })
  }

  public async delete(id: string) {
    return await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    })
  }
}
