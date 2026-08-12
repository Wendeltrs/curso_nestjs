import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { QueryDto } from 'src/services/query/query.decorator'
import { UserCreateDTO, UserUpdateDTO } from './auth.dto'

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  public async getAll(query?: QueryDto) {
    return await this.prisma.user.findMany({
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

  public async create(data: UserCreateDTO) {
    return await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
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
        password: data.password,
      },
    })
  }

  //   public async changeAvatar(id: string, file: ChangeAvatarDTO) {
  //     return await this.prisma.user.update({
  //       where: {
  //         id,
  //       },
  //       data: {
  //         avatar: file,
  //       },
  //     })
  //   }

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
