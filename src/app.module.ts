import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { SessionService } from './common/services/session/session.service'
import { AuthModule } from './modules/auth/auth.module'
import { CommentsModule } from './modules/comments/comments.module'
import { ProjectCollaboratorsModule } from './modules/project-collaborators/project-collaborators.module'
import { ProjectsModule } from './modules/projects/projects.module'
import { TasksModule } from './modules/tasks/tasks.module'
import { UsersModule } from './modules/users/users.module'
import { PrismaService } from './prisma/prisma.service'
import { MailModule } from './modules/mail/mail.module';

@Module({
  imports: [
    ProjectsModule,
    TasksModule,
    UsersModule,
    ProjectCollaboratorsModule,
    CommentsModule,
    AuthModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, SessionService],
})
export class AppModule {}
