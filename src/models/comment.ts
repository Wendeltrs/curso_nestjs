import { Expose, Type } from 'class-transformer'
import { Task } from './task'
import { User } from './user'

export class Comment {
  @Expose()
  id: string

  @Expose()
  content: string

  @Expose()
  authorId: string

  @Expose()
  @Type(() => User)
  author: User

  @Expose()
  taskId: string

  @Expose()
  @Type(() => Task)
  task: Task

  @Expose()
  createdAt: Date

  @Expose()
  updatedAt: Date

  @Expose()
  deletedAt: Date
}
