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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { Paginator } from 'src/common/decorators/paginator/paginator.decorator'
import { Serializer } from 'src/common/decorators/serializer/serializer.decorator'
import { ValidateResourcesIds } from 'src/common/decorators/validate-resources-ids/validate-resources-ids.decorator'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth/jwt-auth.guard'
import { ValidateResourcesIdsInterceptor } from 'src/common/interceptors/validate-resources-ids/validate-resources-ids.interceptor'
import { QueryDto, QueryPaginator } from 'src/common/services/query/query.decorator'
import { Project } from 'src/models/project'
import { ProjectCreateDTO, ProjectDTO, ProjectFullDTO, ProjectUpdateDTO } from './projects.dto'
import { ProjectsService } from './projects.service'

@Controller({
  path: 'projects',
  version: '1',
})
@UseGuards(JwtAuthGuard)
@UseInterceptors(ValidateResourcesIdsInterceptor)
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Get()
  @ApiResponse({ type: [ProjectFullDTO] })
  @Paginator()
  @Serializer(Project)
  public getAll(@QueryPaginator() query: QueryDto) {
    return this.projectsService.getAll(query)
  }

  @Get(':projectId')
  @ApiResponse({ type: ProjectFullDTO })
  @ValidateResourcesIds()
  @Serializer(Project)
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
