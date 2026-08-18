import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { TasksDTO } from '../tasks/tasks.dto'
import { UsersDTO } from '../users/users.dto'

export class CommentDTO {
  @ApiProperty() id: string
  @ApiProperty() content: string
  @ApiProperty() authorId: string
  @ApiProperty() taskId: string
  @ApiProperty({ format: 'date-time' }) createdAt: string
  @ApiProperty({ format: 'date-time' }) updatedAt: string
  @ApiProperty({ format: 'date-time' }) deletedAt: string
}

export class CommentFullDTO extends CommentDTO {
  @ApiProperty({ type: () => UsersDTO }) author: UsersDTO
  @ApiProperty({ type: () => TasksDTO }) task: TasksDTO
}

export class CommentCreateDTO {
  @ApiProperty({ description: 'Comment content' })
  @IsString()
  @IsNotEmpty()
  content: string

  @ApiProperty({ description: 'Task id' })
  @IsString()
  @IsNotEmpty()
  taskId: string
}

export class CommentUpdateDTO {
  @ApiProperty({ description: 'Comment content', required: false })
  @IsString()
  @IsOptional()
  content: string
}
