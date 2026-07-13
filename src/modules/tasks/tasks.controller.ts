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
} from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { QueryDto, QueryPaginator } from 'src/services/query/query.decorator'
import { TaskCreateDTO, TasksDTO, TaskUpdateDTO } from './tasks.dto'
import { TasksService } from './tasks.service'

@Controller({ path: 'tasks', version: '1' })
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  @ApiResponse({ type: [TasksDTO] })
  public getAll(@QueryPaginator() query: QueryDto) {
    return this.tasksService.getAll(query)
  }

  @Get(':id')
  @ApiResponse({ type: TasksDTO })
  public get(@Param('id', ParseUUIDPipe) id: string, @QueryPaginator() query: QueryDto) {
    return this.tasksService.get(id, query)
  }

  @Post()
  @ApiResponse({ type: TasksDTO })
  public create(@Body() data: TaskCreateDTO) {
    return this.tasksService.create(data)
  }

  @Put(':id')
  @ApiResponse({ type: TasksDTO })
  public update(@Param('id', ParseUUIDPipe) id: string, @Body() data: TaskUpdateDTO) {
    return this.tasksService.update(id, data)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.tasksService.delete(id)
  }
}
