import { Module } from '@nestjs/common'
import { CloudinaryService } from 'src/common/services/cloudinary/cloudinary.service'
import { PrismaService } from 'src/common/services/prisma/prisma.service'
import { SessionService } from 'src/common/services/session/session.service'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, SessionService, CloudinaryService],
})
export class UsersModule {}
