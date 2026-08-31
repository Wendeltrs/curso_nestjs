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
import { Comment } from 'src/models/comment'
import { CommentCreateDTO, CommentDTO, CommentFullDTO, CommentUpdateDTO } from './comments.dto'
import { CommentsService } from './comments.service'

@Controller({ path: 'comments', version: '1' })
@UseGuards(JwtAuthGuard)
@UseInterceptors(ValidateResourcesIdsInterceptor)
@ApiBearerAuth('jwt')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Get()
  @ApiPaginatedResponse(CommentFullDTO)
  @Paginator()
  @Serializer(Comment)
  public async getAll(@QueryPaginator() query: QueryDto, @Query('taskId') taskId: string) {
    return await this.commentsService.getAll({ ...query, taskId })
  }

  @Get(':commentId')
  @ApiResponse({ type: CommentFullDTO, status: HttpStatus.OK })
  @ValidateResourcesIds()
  @Serializer(Comment)
  public async get(
    @Param('commentId', ParseUUIDPipe) id: string,
    @QueryPaginator() query: QueryDto,
    @Query('taskId') taskId: string,
  ) {
    return await this.commentsService.get(id, { ...query, taskId })
  }

  @Post()
  @ApiResponse({
    type: CommentDTO,
    status: HttpStatus.CREATED,
  })
  public async create(@Body() data: CommentCreateDTO) {
    return await this.commentsService.create(data)
  }

  @Put(':commentId')
  @ApiResponse({
    type: CommentDTO,
    status: HttpStatus.OK,
  })
  @ValidateResourcesIds()
  public async update(
    @Param('commentId', ParseUUIDPipe) id: string,
    @Body() data: CommentUpdateDTO,
  ) {
    return await this.commentsService.update(id, data)
  }

  @Delete(':commentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ValidateResourcesIds()
  @ApiNoContentResponse({ description: 'Comment deleted successfully' })
  public async delete(@Param('commentId', ParseUUIDPipe) id: string) {
    await this.commentsService.delete(id)
  }
}
