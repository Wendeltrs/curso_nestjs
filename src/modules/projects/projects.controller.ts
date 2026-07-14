import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { ValidateResourcesIds } from 'src/common/decorators/validate-resources-ids.decorator'
import { ValidateResourcesIdsInterceptor } from 'src/common/interceptors/validate-resources-ids.interceptor'
import { QueryDto, QueryPaginator } from 'src/services/query/query.decorator'
import { ProjectCreateDTO, ProjectDTO, ProjectUpdateDTO } from './projects.dto'
import { ProjectsService } from './projects.service'

@Controller({
  path: 'projects',
  version: '1',
})
@UseInterceptors(ValidateResourcesIdsInterceptor)
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Get()
  @ApiResponse({
    type: [ProjectDTO],
  })
  public getAll(@QueryPaginator() query: QueryDto) {
    return this.projectsService.getAll(query)
  }

  @Get(':projectId')
  @ApiResponse({
    type: ProjectDTO,
  })
  @ValidateResourcesIds()
  public get(@Param('projectId', ParseUUIDPipe) id: string) {
    return this.projectsService.get(id)
  }

  @Post()
  @ApiResponse({
    type: ProjectDTO,
  })
  public create(@Body() data: ProjectCreateDTO) {
    return this.projectsService.create(data)
  }

  @Put(':projectId')
  @ApiResponse({
    type: ProjectDTO,
  })
  @ValidateResourcesIds()
  public update(@Param('projectId', ParseUUIDPipe) id: string, @Body() data: ProjectUpdateDTO) {
    return this.projectsService.update(id, data)
  }

  @Delete(':projectId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ValidateResourcesIds()
  public delete(@Param('projectId', ParseUUIDPipe) id: string) {
    return this.projectsService.delete(id)
  }
}
