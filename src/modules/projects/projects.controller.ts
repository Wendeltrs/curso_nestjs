import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common'
import { ProjectDTO } from './projects.dto'
import { ProjectsService } from './projects.service'

@Controller({
  path: 'projects',
  version: '1',
})
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Get()
  public getAll() {
    return this.projectsService.getAll()
  }

  @Get(':id')
  public get(@Param('id', ParseUUIDPipe) id: string) {
    return this.projectsService.get(id)
  }

  @Post()
  public create(@Body() data: ProjectDTO) {
    return this.projectsService.create(data)
  }

  @Put(':id')
  public update(@Param('id', ParseUUIDPipe) id: string, @Body() data: ProjectDTO) {
    return this.projectsService.update(id, data)
  }

  @Delete(':id')
  public delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.projectsService.delete(id)
  }
}
