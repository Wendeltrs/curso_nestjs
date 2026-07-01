import { ApiProperty } from '@nestjs/swagger'

export class ProjectDTO {
  @ApiProperty({ description: 'Project name' })
  name: string = ''

  @ApiProperty({ description: 'Project description', required: false })
  description: string = ''
}
