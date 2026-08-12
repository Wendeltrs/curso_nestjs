import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { ProjectCollaboratorDTO } from '../project-collaborators/project-collaborators.dto'
import { TasksDTO } from '../tasks/tasks.dto'
import { UsersDTO } from '../users/users.dto'

export class ProjectDTO {
  @ApiProperty() id: string
  @ApiProperty() name: string
  @ApiProperty() description: string
  @ApiProperty() creatorId: string
  @ApiProperty({ format: 'date-time' }) createdAt: string
  @ApiProperty({ format: 'date-time' }) updatedAt: string
  @ApiProperty({ format: 'date-time' }) deletedAt: string
}

export class ProjectFullDTO extends ProjectDTO {
  @ApiProperty({ type: () => [TasksDTO] }) tasks: TasksDTO[]
  @ApiProperty({ type: () => UsersDTO }) creator: UsersDTO
  @ApiProperty({ type: () => [ProjectCollaboratorDTO] }) collaborators: ProjectCollaboratorDTO[]
}

export class ProjectCreateDTO {
  @ApiProperty({ description: 'Project name' })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({ description: 'Project description', required: false })
  @IsString()
  @IsOptional()
  description: string

  @ApiProperty({ description: 'Project creator' })
  @IsString()
  @IsNotEmpty()
  creatorId: string
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

  @ApiProperty({ description: 'Project creator', required: false })
  @IsString()
  @IsOptional()
  creatorId: string
}
