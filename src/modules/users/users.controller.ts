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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiNoContentResponse,
  ApiResponse,
} from '@nestjs/swagger'
import { Paginator } from 'src/common/decorators/paginator/paginator.decorator'
import { QueryDto, QueryPaginator } from 'src/common/decorators/query/query.decorator'
import { Serializer } from 'src/common/decorators/serializer/serializer.decorator'
import { ApiPaginatedResponse } from 'src/common/decorators/swagger/api-paginated-response.decorator'
import { ValidateResourcesIds } from 'src/common/decorators/validate-resources-ids/validate-resources-ids.decorator'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth/jwt-auth.guard'
import { ValidateResourcesIdsInterceptor } from 'src/common/interceptors/validate-resources-ids/validate-resources-ids.interceptor'
import { User } from 'src/models/user'
import { UserEmailDTO, UsersDTO, UsersFullDTO, UserUpdateDTO } from './users.dto'
import { UsersService } from './users.service'

@Controller({ path: 'users', version: '1' })
@UseGuards(JwtAuthGuard)
@UseInterceptors(ValidateResourcesIdsInterceptor)
@ApiBearerAuth('jwt')
@Serializer(User)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @Paginator()
  @ApiPaginatedResponse(UsersFullDTO)
  public async getAll(@QueryPaginator() query?: QueryDto) {
    return await this.usersService.getAll(query)
  }

  @Get(':userId')
  @ValidateResourcesIds()
  @ApiResponse({ status: HttpStatus.OK, type: UsersFullDTO })
  public async get(@Param('userId') id: string) {
    return await this.usersService.get(id)
  }

  @Get('/email')
  @ApiResponse({ status: HttpStatus.OK, type: UsersFullDTO })
  public async getEmail(@Body() data: UserEmailDTO) {
    return await this.usersService.getEmail(data.email)
  }

  @Put(':userId')
  @ValidateResourcesIds()
  @ApiResponse({ status: HttpStatus.OK, type: UsersDTO })
  public async update(@Param('userId') id: string, @Body() data: UserUpdateDTO) {
    return await this.usersService.update(id, data)
  }

  @Delete(':userId')
  @ValidateResourcesIds()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'User deleted successfully' })
  public async delete(@Param('userId') id: string) {
    await this.usersService.delete(id)
  }

  @Post('/avatar')
  @ApiResponse({
    status: HttpStatus.OK,
    type: UsersDTO,
    description: 'User avatar uploaded successfully',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid data' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file'))
  public async uploadAvatar(@UploadedFile() file: Express.Multer.File) {
    return await this.usersService.uploadAvatar(file)
  }
}
