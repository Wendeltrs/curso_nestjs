import { Expose, Type } from 'class-transformer'
import { Collaborator } from './collaborator'
import { Comment } from './comment'
import { Project } from './project'
import { Task } from './task'

export class User {
  @Expose()
  id: string

  @Expose()
  name: string

  @Expose()
  email: string

  @Expose()
  role: string

  @Expose()
  @Type(() => Project)
  projects: Project[]

  @Expose()
  @Type(() => Task)
  tasksAssigned: Task[]

  @Expose()
  @Type(() => Collaborator)
  collaborations: Collaborator[]

  @Expose()
  @Type(() => Comment)
  comments: Comment[]

  @Expose()
  createdAt: Date

  @Expose()
  updatedAt: Date

  @Expose()
  deletedAt: Date
}
