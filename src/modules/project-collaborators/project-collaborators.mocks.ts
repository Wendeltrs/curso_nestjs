import { faker } from '@faker-js/faker'
import { Project, ProjectCollaborator, User } from '@prisma/client'

type CollaboratosWithRelations = ProjectCollaborator & {
  user: User
  project: Project
}

export const mockedCollaborators = faker.helpers.multiple<CollaboratosWithRelations>(() => {
  return {
    id: faker.string.uuid(),
    userId: 'user-1',
    projectId: 'project-1',
    role: 'OWNER',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    user: {
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
    project: {
      id: 'project-1',
      name: faker.lorem.sentence(),
      description: faker.lorem.sentence(),
      creatorId: 'user-1',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    },
  }
})

export const mockedCreateCollaborator = {
  projectId: mockedCollaborators[0].projectId,
  userId: mockedCollaborators[0].userId,
  role: mockedCollaborators[0].role,
}
