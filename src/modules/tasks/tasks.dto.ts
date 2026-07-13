import { ApiProperty } from '@nestjs/swagger'
import { TaskPriority, TaskStatus } from '@prisma/client'
import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class TasksDTO {
  @ApiProperty() id: string
  @ApiProperty() title: string
  @ApiProperty() description: string
  @ApiProperty() status: TaskStatus
  @ApiProperty() priority: TaskPriority
  @ApiProperty() projectId: string
  @ApiProperty({ format: 'date-time' }) dueDate: string
  @ApiProperty({ format: 'date-time' }) createdAt: string
  @ApiProperty({ format: 'date-time' }) updatedAt: string
  @ApiProperty({ format: 'date-time' }) deletedAt: string
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

  @ApiProperty({ format: 'date-time', description: 'Task due date', required: false })
  @IsDateString()
  @IsOptional()
  dueDate?: string
}

export class TaskUpdateDTO extends TaskCreateDTO {}
