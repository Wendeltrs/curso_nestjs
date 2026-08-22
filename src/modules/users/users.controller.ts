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
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiResponse } from '@nestjs/swagger'
//import { Paginator } from 'src/common/decorators/paginator/paginator.decorator'
import { Serializer } from 'src/common/decorators/serializer/serializer.decorator'
import { ValidateResourcesIds } from 'src/common/decorators/validate-resources-ids/validate-resources-ids.decorator'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth/jwt-auth.guard'
import { ValidateResourcesIdsInterceptor } from 'src/common/interceptors/validate-resources-ids/validate-resources-ids.interceptor'
import { QueryDto, QueryPaginator } from 'src/common/services/query/query.decorator'
import { User } from 'src/models/user'
import { UserCreateDTO, UsersDTO, UsersFullDTO, UserUpdateDTO } from './users.dto'
import { UsersService } from './users.service'

@Controller({ path: 'users', version: '1' })
@UseGuards(JwtAuthGuard)
@UseInterceptors(ValidateResourcesIdsInterceptor)
@ApiBearerAuth('jwt')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  // @Paginator()
  @Serializer(User)
  @ApiResponse({ status: HttpStatus.OK, type: [UsersFullDTO] })
  public async getAll(@QueryPaginator() query?: QueryDto) {
    return await this.usersService.getAll(query)
  }

  @Get(':userId')
  @ValidateResourcesIds()
  @Serializer(User)
  @ApiResponse({ status: HttpStatus.OK, type: UsersFullDTO })
  public async get(@Param('userId') id: string) {
    return await this.usersService.get(id)
  }

  @Get('/email')
  @Serializer(User)
  @ApiResponse({ status: HttpStatus.OK, type: UsersFullDTO })
  public async getEmail(@Body() data: { email: string }) {
    return await this.usersService.getEmail(data.email)
  }

  @Post()
  @Serializer(User)
  @ApiResponse({ status: HttpStatus.CREATED, type: UsersDTO })
  public async create(@Body() data: UserCreateDTO) {
    return await this.usersService.create(data)
  }

  @Put(':userId')
  @ValidateResourcesIds()
  @Serializer(User)
  @ApiResponse({ status: HttpStatus.OK, type: UsersDTO })
  public async update(@Param('userId') id: string, @Body() data: UserUpdateDTO) {
    return await this.usersService.update(id, data)
  }

  @Delete(':userId')
  @ValidateResourcesIds()
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param('userId') id: string) {
    return await this.usersService.delete(id)
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
  @Serializer(User)
  public async uploadAvatar(@UploadedFile() file: Express.Multer.File) {
    return await this.usersService.uploadAvatar(file)
  }
}
