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
import { Paginator } from 'src/common/decorators/paginator/paginator.decorator'
import { Serializer } from 'src/common/decorators/serializer/serializer.decorator'
import { ValidateResourcesIds } from 'src/common/decorators/validate-resources-ids/validate-resources-ids.decorator'
import { Comment } from 'src/models/comment'
import { QueryDto, QueryPaginator } from 'src/services/query/query.decorator'
import { CommentCreateDTO, CommentDTO, CommentFullDTO, CommentUpdateDTO } from './comments.dto'
import { CommentsService } from './comments.service'

@Controller({ path: 'comments', version: '1' })
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Get()
  @ApiResponse({ type: [CommentFullDTO] })
  @Paginator()
  @Serializer(Comment)
  public getAll(@QueryPaginator() query: QueryDto) {
    return this.commentsService.getAll(query)
  }

  @Get(':commentId')
  @ApiResponse({ type: CommentFullDTO })
  @ValidateResourcesIds()
  @Serializer(Comment)
  public get(@Param('commentId', ParseUUIDPipe) id: string, @QueryPaginator() query: QueryDto) {
    return this.commentsService.get(id, query)
  }

  @Post()
  @ApiResponse({
    type: CommentDTO,
  })
  public create(@Body() data: CommentCreateDTO) {
    return this.commentsService.create(data)
  }

  @Put(':commentId')
  @ApiResponse({
    type: CommentDTO,
  })
  @ValidateResourcesIds()
  public update(@Param('commentId', ParseUUIDPipe) id: string, @Body() data: CommentUpdateDTO) {
    return this.commentsService.update(id, data)
  }

  @Delete(':commentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ValidateResourcesIds()
  public delete(@Param('commentId', ParseUUIDPipe) id: string) {
    return this.commentsService.delete(id)
  }
}
