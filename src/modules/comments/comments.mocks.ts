import { faker } from '@faker-js/faker'
import { Comment, Task, User } from '@prisma/client'
import { mockPaginationQuery } from 'src/common/mocks/tests.mocks'

type CommentsWithRelations = Comment & {
  author: User
  task: Task
}

export const mockedComments = faker.helpers.multiple<CommentsWithRelations>(() => {
  return {
    id: faker.string.uuid(),
    content: faker.lorem.sentence(),
    authorId: 'user-1',
    taskId: 'task-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    author: {
      id: 'user-1',
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.string.alphanumeric(10),
      avatar: null,
      role: 'USER',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    },
    task: {
      id: 'task-1',
      title: faker.lorem.sentence(),
      description: faker.lorem.sentence(),
      assigneeId: 'user-1',
      projectId: 'project-1',
      priority: 'MEDIUM',
      status: 'TODO',
      createdAt: new Date(),
      dueDate: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    },
  }
})

export const mockedCreateComment = {
  content: faker.lorem.sentence(),
  taskId: 'task-1',
}

export const mockedQueryComment = {
  ...mockPaginationQuery,
  taskId: 'task-1',
}
