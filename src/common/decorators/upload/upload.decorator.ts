import { applyDecorators, HttpCode, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

export type FileData = Express.Multer.File

interface UploadProps {
  statusCode?: number
}

export const Upload = (data?: UploadProps) => {
  return applyDecorators(
    HttpCode(data?.statusCode ?? 204),
    UseInterceptors(
      FileInterceptor('data', {
        limits: {
          fileSize: 5 * 1024 * 1024,
        },
        storage: diskStorage({
          destination: './temp',
          filename(_request, file, callback) {
            const fileName = uuidv4() + path.extname(file.originalname)
            return callback(null, fileName)
          },
        }),
      }),
    ),
  )
}
