import { Expose, Type } from 'class-transformer'
import { Project } from './project'
import { User } from './user'

export class Collaborator {
  @Expose()
  id: string

  @Expose()
  role: string

  @Expose()
  userId: string

  @Expose()
  @Type(() => User)
  user: User

  @Expose()
  projectId: string

  @Expose()
  project: Project

  @Expose()
  createdAt: Date

  @Expose()
  updatedAt: Date

  @Expose()
  deletedAt: Date
}
