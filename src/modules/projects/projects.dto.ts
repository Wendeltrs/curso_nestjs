import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { TasksDTO } from '../tasks/tasks.dto'

export class ProjectDTO {
  @ApiProperty() id: string
  @ApiProperty() name: string
  @ApiProperty() description: string
  @ApiProperty({ type: [TasksDTO] }) tasks: TasksDTO[]
  @ApiProperty({ format: 'date-time' }) createdAt: string
  @ApiProperty({ format: 'date-time' }) updatedAt: string
  @ApiProperty({ format: 'date-time' }) deletedAt: string
}

export class ProjectCreateDTO {
  @ApiProperty({ description: 'Project name' })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({ description: 'Project description', required: false })
  @IsString()
  description: string
}

export class ProjectUpdateDTO {
  @ApiProperty({ description: 'Project name', required: false })
  @IsString()
  @IsOptional()
  name: string

  @ApiProperty({ description: 'Project description', required: false })
  @IsString()
  @IsOptional()
  description: string
}
