import { Readable } from 'node:stream'
import { faker } from '@faker-js/faker'
import { Comment, Project, ProjectCollaborator, Task, User } from '@prisma-generated/client'

type UserRelations = User & {
  projects: Project[]
  tasksAssigned: Task[]
  comments: Comment[]
  collaborations: ProjectCollaborator[]
}

export const mockedUsers = faker.helpers.multiple<UserRelations>(
  () => {
    return {
      id: faker.string.uuid(),
      name: faker.lorem.sentence(),
      email: faker.internet.email(),
      password: faker.string.alphanumeric(8),
      avatar: faker.image.avatar(),
      role: 'USER',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      projects: [],
      tasksAssigned: [],
      comments: [],
      collaborations: [],
    }
  },
  { count: 10 },
)

export const mockedFile = {
  fieldname: 'avatar',
  originalname: 'avatar.png',
  encoding: '7bit',
  mimetype: 'image/png',
  buffer: Buffer.from(''),
  size: 0,
  stream: Readable.from(''),
  destination: '',
  filename: '',
  path: '',
}
