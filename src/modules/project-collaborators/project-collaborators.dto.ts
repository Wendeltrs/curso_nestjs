import { ApiProperty } from '@nestjs/swagger'
import { CollaboratorRole } from '@prisma-generated/client'
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { ProjectDTO } from '../projects/projects.dto'
import { UsersDTO } from '../users/users.dto'

export class ProjectCollaboratorDTO {
  @ApiProperty() id: string
  @ApiProperty({ enum: CollaboratorRole, default: CollaboratorRole.EDITOR }) role: CollaboratorRole
  @ApiProperty() userId: string
  @ApiProperty() projectId: string
  @ApiProperty({ format: 'date-time' }) createdAt: string
  @ApiProperty({ format: 'date-time' }) updatedAt: string
  @ApiProperty({ format: 'date-time' }) deletedAt: string
}

export class ProjectCollaboratorFullDTO extends ProjectCollaboratorDTO {
  @ApiProperty({ type: () => UsersDTO }) user: UsersDTO
  @ApiProperty({ type: () => ProjectDTO }) project: ProjectDTO
}

export class ProjectCollaboratorCreateDTO {
  @ApiProperty({
    description: 'Collaborator role',
    enum: CollaboratorRole,
    default: CollaboratorRole.EDITOR,
    required: false,
  })
  @IsEnum(CollaboratorRole)
  @IsOptional()
  role?: CollaboratorRole = CollaboratorRole.EDITOR

  @ApiProperty({ description: 'User id' })
  @IsString()
  @IsNotEmpty()
  userId: string

  @ApiProperty({ description: 'Project id' })
  @IsString()
  @IsNotEmpty()
  projectId: string
}

export class ProjectCollaboratorUpdateDTO {
  @ApiProperty({
    description: 'Collaborator role',
    enum: CollaboratorRole,
    required: false,
  })
  @IsEnum(CollaboratorRole)
  @IsOptional()
  role: CollaboratorRole
}
