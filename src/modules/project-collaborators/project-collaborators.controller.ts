import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
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
import { Collaborator } from 'src/models/collaborator'
import {
  ProjectCollaboratorCreateDTO,
  ProjectCollaboratorDTO,
  ProjectCollaboratorFullDTO,
  ProjectCollaboratorUpdateDTO,
} from './project-collaborators.dto'
import { ProjectCollaboratorsService } from './project-collaborators.service'

@Controller({ path: 'project-collaborators', version: '1' })
@UseGuards(JwtAuthGuard)
@UseInterceptors(ValidateResourcesIdsInterceptor)
export class ProjectCollaboratorsController {
  constructor(private projectCollaboratorsService: ProjectCollaboratorsService) {}

  @Get()
  @Paginator()
  @Serializer(Collaborator)
  @ApiResponse({ status: HttpStatus.OK, type: [ProjectCollaboratorFullDTO] })
  public async getAll(@QueryPaginator() query?: QueryDto) {
    return await this.projectCollaboratorsService.getAll(query)
  }

  @Get(':collaboratorId')
  @ValidateResourcesIds()
  @Serializer(Collaborator)
  @ApiResponse({ status: HttpStatus.OK, type: ProjectCollaboratorFullDTO })
  public async get(@Param('collaboratorId') id: string, @QueryPaginator() query: QueryDto) {
    return await this.projectCollaboratorsService.get(id, query)
  }

  @Post()
  @ApiResponse({ status: HttpStatus.CREATED, type: ProjectCollaboratorDTO })
  public async create(@Body() data: ProjectCollaboratorCreateDTO) {
    return await this.projectCollaboratorsService.create(data)
  }

  @Put(':collaboratorId')
  @ValidateResourcesIds()
  @ApiResponse({ status: HttpStatus.OK, type: ProjectCollaboratorDTO })
  public async update(
    @Param('collaboratorId') id: string,
    @Body() data: ProjectCollaboratorUpdateDTO,
  ) {
    return await this.projectCollaboratorsService.update(id, data)
  }

  @Delete(':collaboratorId')
  @ValidateResourcesIds()
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param('collaboratorId') id: string) {
    return await this.projectCollaboratorsService.delete(id)
  }
}
