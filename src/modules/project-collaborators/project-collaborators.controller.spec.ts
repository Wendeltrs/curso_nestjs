import { Test, TestingModule } from '@nestjs/testing';
import { ProjectCollaboratorsController } from './project-collaborators.controller';

describe('ProjectCollaboratorsController', () => {
  let controller: ProjectCollaboratorsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectCollaboratorsController],
    }).compile();

    controller = module.get<ProjectCollaboratorsController>(ProjectCollaboratorsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
