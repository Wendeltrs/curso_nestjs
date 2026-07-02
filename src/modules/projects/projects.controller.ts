import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { ProjectDTO, ProjectListItemDTO } from './projects.dto'
import { ProjectsService } from './projects.service'

@Controller({
  path: 'projects',
  version: '1',
})
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Get()
  @ApiResponse({
    type: [ProjectListItemDTO],
  })
  public getAll() {
    return this.projectsService.getAll()
  }

  @Get(':id')
  @ApiResponse({
    type: ProjectListItemDTO,
  })
  public get(@Param('id', ParseUUIDPipe) id: string) {
    return this.projectsService.get(id)
  }

  @Post()
  @ApiResponse({
    type: ProjectListItemDTO,
  })
  public create(@Body() data: ProjectDTO) {
    return this.projectsService.create(data)
  }

  @Put(':id')
  @ApiResponse({
    type: ProjectListItemDTO,
  })
  public update(@Param('id', ParseUUIDPipe) id: string, @Body() data: ProjectDTO) {
    return this.projectsService.update(id, data)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.projectsService.delete(id)
  }
}
