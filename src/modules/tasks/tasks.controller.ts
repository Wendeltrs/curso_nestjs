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
  Query,
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
import { Task } from 'src/models/task'
import { TaskCreateDTO, TasksDTO, TasksFullDTO, TaskUpdateDTO } from './tasks.dto'
import { TasksService } from './tasks.service'

@Controller({ path: 'tasks', version: '1' })
@UseGuards(JwtAuthGuard)
@UseInterceptors(ValidateResourcesIdsInterceptor)
@ApiBearerAuth('jwt')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  @ApiPaginatedResponse(TasksFullDTO)
  @Paginator()
  @Serializer(Task)
  public getAll(@QueryPaginator() query: QueryDto, @Query('projectId') projectId: string) {
    return this.tasksService.getAll({ ...query, projectId })
  }

  @Get(':taskId')
  @ApiResponse({ type: TasksFullDTO, status: HttpStatus.OK })
  @ValidateResourcesIds()
  @Serializer(Task)
  public get(
    @Param('taskId', ParseUUIDPipe) id: string,
    @QueryPaginator() query: QueryDto,
    @Query('projectId') projectId: string,
  ) {
    return this.tasksService.get(id, { ...query, projectId })
  }

  @Post()
  @ApiResponse({ type: TasksDTO, status: HttpStatus.CREATED })
  public create(@Body() data: TaskCreateDTO) {
    return this.tasksService.create(data)
  }

  @Put(':taskId')
  @ApiResponse({ type: TasksDTO, status: HttpStatus.OK })
  @ValidateResourcesIds()
  public update(@Param('taskId', ParseUUIDPipe) id: string, @Body() data: TaskUpdateDTO) {
    return this.tasksService.update(id, data)
  }

  @Delete(':taskId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ValidateResourcesIds()
  @ApiNoContentResponse({ description: 'Task deleted successfully' })
  public delete(@Param('taskId', ParseUUIDPipe) id: string) {
    return this.tasksService.delete(id)
  }
}
