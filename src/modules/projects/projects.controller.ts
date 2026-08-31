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
import { ApiBearerAuth, ApiNoContentResponse, ApiResponse } from '@nestjs/swagger'
import { Paginator } from 'src/common/decorators/paginator/paginator.decorator'
import { QueryDto, QueryPaginator } from 'src/common/decorators/query/query.decorator'
import { Serializer } from 'src/common/decorators/serializer/serializer.decorator'
import { ApiPaginatedResponse } from 'src/common/decorators/swagger/api-paginated-response.decorator'
import { ValidateResourcesIds } from 'src/common/decorators/validate-resources-ids/validate-resources-ids.decorator'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth/jwt-auth.guard'
import { ValidateResourcesIdsInterceptor } from 'src/common/interceptors/validate-resources-ids/validate-resources-ids.interceptor'
import { Project } from 'src/models/project'
import { ProjectCreateDTO, ProjectDTO, ProjectFullDTO, ProjectUpdateDTO } from './projects.dto'
import { ProjectsService } from './projects.service'

@Controller({
  path: 'projects',
  version: '1',
})
@UseGuards(JwtAuthGuard)
@UseInterceptors(ValidateResourcesIdsInterceptor)
@ApiBearerAuth('jwt')
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Get()
  @ApiPaginatedResponse(ProjectFullDTO)
  @Paginator()
  @Serializer(Project)
  public async getAll(@QueryPaginator() query?: QueryDto) {
    return await this.projectsService.getAll(query)
  }

  @Get(':projectId')
  @ApiResponse({ type: ProjectFullDTO, status: HttpStatus.OK })
  @ValidateResourcesIds()
  @Serializer(Project)
  public async get(@Param('projectId', ParseUUIDPipe) id: string) {
    return await this.projectsService.get(id)
  }

  @Post()
  @ApiResponse({
    type: ProjectDTO,
    status: HttpStatus.CREATED,
  })
  public async create(@Body() data: ProjectCreateDTO) {
    return await this.projectsService.create(data)
  }

  @Put(':projectId')
  @ApiResponse({
    type: ProjectDTO,
    status: HttpStatus.OK,
  })
  @ValidateResourcesIds()
  public async update(@Param('projectId', ParseUUIDPipe) id: string, @Body() data: ProjectUpdateDTO) {
    return await this.projectsService.update(id, data)
  }

  @Delete(':projectId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ValidateResourcesIds()
  @ApiNoContentResponse({ description: 'Project deleted successfully' })
  public async delete(@Param('projectId', ParseUUIDPipe) id: string) {
    await this.projectsService.delete(id)
  }
}
