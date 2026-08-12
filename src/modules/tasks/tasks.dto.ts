import { ApiProperty } from '@nestjs/swagger'
import { TaskPriority, TaskStatus } from '@prisma/client'
import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { CommentDTO } from '../comments/comments.dto'
import { ProjectDTO } from '../projects/projects.dto'
import { UsersDTO } from '../users/users.dto'

export class TasksDTO {
  @ApiProperty() id: string
  @ApiProperty() title: string
  @ApiProperty() description: string
  @ApiProperty({ enum: TaskStatus, default: TaskStatus.TODO }) status: TaskStatus
  @ApiProperty({ enum: TaskPriority, default: TaskPriority.MEDIUM }) priority: TaskPriority
  @ApiProperty() projectId: string
  @ApiProperty() assineeId: string
  @ApiProperty({ format: 'date-time' }) dueDate: string
  @ApiProperty({ format: 'date-time' }) createdAt: string
  @ApiProperty({ format: 'date-time' }) updatedAt: string
  @ApiProperty({ format: 'date-time' }) deletedAt: string
}

export class TasksFullDTO extends TasksDTO {
  @ApiProperty({ type: () => ProjectDTO }) project: ProjectDTO
  @ApiProperty({ type: () => UsersDTO }) assinee: UsersDTO
  @ApiProperty({ type: () => [CommentDTO] }) comments: CommentDTO[]
}

export class TaskCreateDTO {
  @ApiProperty({ description: 'Task title' })
  @IsString()
  @IsNotEmpty()
  title: string

  @ApiProperty({ description: 'Task description', required: false })
  @IsString()
  @IsOptional()
  description?: string

  @ApiProperty({ description: 'Task assignee', required: false })
  @IsString()
  @IsOptional()
  assineeId?: string

  @ApiProperty({
    description: 'Task status',
    enum: TaskStatus,
    default: TaskStatus.TODO,
    required: false,
  })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus = TaskStatus.TODO

  @ApiProperty({
    description: 'Task priority',
    enum: TaskPriority,
    default: TaskPriority.MEDIUM,
    required: false,
  })
  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority = TaskPriority.MEDIUM

  @ApiProperty({ description: 'Project id' })
  @IsString()
  @IsOptional()
  projectId: string

  @ApiProperty({ description: 'Task due date', required: false })
  @IsDateString()
  @IsOptional()
  dueDate?: string
}

export class TaskUpdateDTO {
  @ApiProperty({ description: 'Task title', required: false })
  @IsString()
  @IsOptional()
  title: string

  @ApiProperty({ description: 'Task description', required: false })
  @IsString()
  @IsOptional()
  description?: string

  @ApiProperty({ description: 'Task assignee', required: false })
  @IsString()
  @IsOptional()
  assineeId?: string

  @ApiProperty({
    description: 'Task status',
    enum: TaskStatus,
    default: TaskStatus.TODO,
    required: false,
  })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus = TaskStatus.TODO

  @ApiProperty({
    description: 'Task priority',
    enum: TaskPriority,
    default: TaskPriority.MEDIUM,
    required: false,
  })
  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority = TaskPriority.MEDIUM

  @ApiProperty({ description: 'Project id', required: false })
  @IsString()
  @IsOptional()
  projectId: string

  @ApiProperty({ description: 'Task due date', required: false })
  @IsDateString()
  @IsOptional()
  dueDate?: string
}
