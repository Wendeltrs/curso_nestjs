import { faker } from '@faker-js/faker'
import { Project, Task, User } from '@prisma-generated/client'

export type ProjectWithRelations = Project & {
  tasks: Task[]
  creator: User
}

export const mockedProjects = faker.helpers.multiple<ProjectWithRelations>(
  () => {
    return {
      id: faker.string.uuid(),
      name: faker.lorem.sentence(),
      description: faker.lorem.sentence(),
      creatorId: 'user-1',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      tasks: [],
      creator: {
        id: faker.string.uuid(),
        name: faker.lorem.sentence(),
        email: faker.internet.email(),
        password: faker.string.alphanumeric(6),
        avatar: faker.image.avatar(),
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
    }
  },
  { count: 10 },
)
