import { Writable } from 'node:stream'
import { Test, TestingModule } from '@nestjs/testing'
import { v2 as cloudinary } from 'cloudinary'
import { mockedFile } from 'src/modules/users/users.mocks'
import { CloudinaryService } from './cloudinary.service'

jest.mock('cloudinary', () => ({
  v2: {
    config: jest.fn(),
    uploader: {
      upload_stream: jest.fn(),
    },
    url: jest.fn(),
  },
}))

describe('CloudinaryService', () => {
  let service: CloudinaryService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CloudinaryService],
    }).compile()

    service = module.get<CloudinaryService>(CloudinaryService)
  })

  it('should be defined and configure cloudinary', () => {
    expect(service).toBeDefined()
    expect(cloudinary.config).toHaveBeenCalled()
  })

  it('upload should resolve with url on success', async () => {
    jest.spyOn(cloudinary, 'config').mockImplementation()
    jest.spyOn(cloudinary, 'url').mockReturnValue('url')
    jest.spyOn(cloudinary.uploader, 'upload_stream').mockImplementation(((
      _options: any,
      cb: any,
    ) => {
      const stream = new Writable({
        write(_chunk, _encoding, callback) {
          callback()
        },
      })

      process.nextTick(() => {
        cb(null, { public_id: 'test' })
      })

      return stream
    }) as any)

    const result = await service.upload(mockedFile, 'test')

    expect(result).toEqual({ url: 'url' })
    expect(cloudinary.uploader.upload_stream).toHaveBeenCalledWith(
      expect.objectContaining({ public_id: 'test' }),
      expect.any(Function),
    )
    expect(cloudinary.url).toHaveBeenCalledWith('test', {
      fetch_format: 'auto',
      quality: 'auto',
    })
  })

  it('upload should reject qhen cloudinary returns error', async () => {
    jest.spyOn(cloudinary.uploader, 'upload_stream').mockImplementation(((
      _options: any,
      cb: any,
    ) => {
      const stream = new Writable({
        write(_chunk, _encoding, callback) {
          callback()
        },
      })

      process.nextTick(() => {
        cb(new Error('upload failed'), null)
      })

      return stream
    }) as any)

    await expect(service.upload(mockedFile, 'test')).rejects.toThrow('upload failed')
  })
})
