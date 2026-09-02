import { faker } from '@faker-js/faker'
import { Comment, Project, Task, User } from '@prisma-generated/client'

type TaskWithRelations = Task & {
  project: Project
  assignee: User | null
  comments: Comment[]
}

export const mockedTasks = faker.helpers.multiple<TaskWithRelations>(() => {
  return {
    id: faker.string.uuid(),
    title: faker.lorem.sentence(),
    description: faker.lorem.sentence(),
    assigneeId: 'user-1',
    projectId: 'project-1',
    project: {
      id: 'project-1',
      name: faker.lorem.sentence(),
      description: faker.lorem.sentence(),
      creatorId: 'user-1',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    },
    assignee: {
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
    status: 'TODO',
    priority: 'MEDIUM',
    dueDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    comments: [],
  }
})

export const mockedCreateAndUpdateTask = {
  title: mockedTasks[0].title,
  description: mockedTasks[0].description as string,
  status: mockedTasks[0].status,
  priority: mockedTasks[0].priority,
  projectId: mockedTasks[0].projectId,
  dueDate: String(mockedTasks[0].dueDate),
}
