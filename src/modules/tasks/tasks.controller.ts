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
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger'
import { Paginator } from 'src/common/decorators/paginator/paginator.decorator'
import { Serializer } from 'src/common/decorators/serializer/serializer.decorator'
import { ValidateResourcesIds } from 'src/common/decorators/validate-resources-ids/validate-resources-ids.decorator'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth/jwt-auth.guard'
import { ValidateResourcesIdsInterceptor } from 'src/common/interceptors/validate-resources-ids/validate-resources-ids.interceptor'
import { QueryDto, QueryPaginator } from 'src/common/services/query/query.decorator'
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
  @ApiResponse({ type: [TasksFullDTO] })
  @Paginator()
  @Serializer(Task)
  public getAll(@QueryPaginator() query: QueryDto) {
    return this.tasksService.getAll(query)
  }

  @Get(':taskId')
  @ApiResponse({ type: TasksFullDTO })
  @ValidateResourcesIds()
  @Serializer(Task)
  public get(@Param('taskId', ParseUUIDPipe) id: string, @QueryPaginator() query: QueryDto) {
    return this.tasksService.get(id, query)
  }

  @Post()
  @ApiResponse({ type: TasksDTO })
  public create(@Body() data: TaskCreateDTO) {
    return this.tasksService.create(data)
  }

  @Put(':taskId')
  @ApiResponse({ type: TasksDTO })
  @ValidateResourcesIds()
  public update(@Param('taskId', ParseUUIDPipe) id: string, @Body() data: TaskUpdateDTO) {
    return this.tasksService.update(id, data)
  }

  @Delete(':taskId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ValidateResourcesIds()
  public delete(@Param('taskId', ParseUUIDPipe) id: string) {
    return this.tasksService.delete(id)
  }
}
