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
import { TaskCreateDTO, TasksDTO, TaskUpdateDTO } from './tasks.dto'
import { TasksService } from './tasks.service'

@Controller({ path: 'tasks', version: '1' })
@UseInterceptors(ValidateResourcesIdsInterceptor)
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  @ApiResponse({ type: [TasksDTO] })
  public getAll(@QueryPaginator() query: QueryDto) {
    return this.tasksService.getAll(query)
  }

  @Get(':taskId')
  @ApiResponse({ type: TasksDTO })
  @ValidateResourcesIds()
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
