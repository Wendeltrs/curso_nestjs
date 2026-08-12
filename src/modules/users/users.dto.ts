import { ApiProperty } from '@nestjs/swagger'
import { Role } from '@prisma/client'
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { FileData } from 'src/common/decorators/upload/upload.decorator'
import { CommentDTO } from '../comments/comments.dto'
import { ProjectCollaboratorDTO } from '../project-collaborators/project-collaborators.dto'
import { ProjectDTO } from '../projects/projects.dto'
import { TasksDTO } from '../tasks/tasks.dto'

export class UsersDTO {
  @ApiProperty() id: string
  @ApiProperty() name: string
  @ApiProperty() email: string
  @ApiProperty({ enum: Role, default: Role.USER }) role: Role
  @ApiProperty({ format: 'date-time' }) createdAt: string
  @ApiProperty({ format: 'date-time' }) updatedAt: string
  @ApiProperty({ format: 'date-time' }) deletedAt: string
}

export class UsersFullDTO extends UsersDTO {
  @ApiProperty({ type: () => [ProjectDTO] }) projects: ProjectDTO[]
  @ApiProperty({ type: () => [TasksDTO] }) tasksAssigned: TasksDTO[]
  @ApiProperty({ type: () => [CommentDTO] }) comments: CommentDTO[]
  @ApiProperty({ type: () => [ProjectCollaboratorDTO] }) collaborations: ProjectCollaboratorDTO[]
}

export class UserCreateDTO {
  @ApiProperty({ description: 'User name' })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({ description: 'User email', uniqueItems: true })
  @IsEmail()
  @IsNotEmpty()
  email: string

  @ApiProperty({ description: 'User password', minLength: 8 })
  @IsString()
  @IsNotEmpty()
  password: string

  @ApiProperty({
    description: 'User role',
    enum: Role,
    default: Role.USER,
    required: false,
  })
  @IsEnum(Role)
  @IsOptional()
  role?: Role = Role.USER
}

export class UserUpdateDTO {
  @ApiProperty({ description: 'User name' })
  @IsString()
  @IsOptional()
  name: string

  @ApiProperty({ description: 'User email' })
  @IsEmail()
  @IsOptional()
  email: string

  @ApiProperty({ description: 'User password' })
  @IsString()
  @IsOptional()
  password: string

  @ApiProperty({
    description: 'User role',
    enum: Role,
    default: Role.USER,
    required: false,
  })
  @IsEnum(Role)
  @IsOptional()
  role?: Role = Role.USER
}

export type ChangeAvatarDTO = FileData
