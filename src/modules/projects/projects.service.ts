import { Injectable } from '@nestjs/common'
import { ProjectDTO } from './projects.dto';

@Injectable()
export class ProjectsService {
  public getAll() {
    return [
      { id: 1, name: 'Project 1' },
      { id: 2, name: 'Project 2' },
      { id: 3, name: 'Project 3' },
    ];
  }

  public get(id: string) {
    return id;
  }

  public create(data: ProjectDTO) {
    return data;
  }

  public update(id: string, data: ProjectDTO) {
    return id + data;
  }

  public delete(id: string) {
    return id;
  }
}
