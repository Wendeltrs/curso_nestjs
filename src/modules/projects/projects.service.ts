import { Injectable } from '@nestjs/common'

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
    return { id, name: `Project ${id}` };
  }

  public create(data: any) {
    return 'create teste';
  }

  public update(id: string, data: any) {
    return 'update teste';
  }

  public delete(id: string) {
    return 'delete teste';
  }
}
