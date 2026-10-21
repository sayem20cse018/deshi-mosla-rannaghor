import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { memoryStorage } from 'multer';
import { MediaService } from './media.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

class UpdateMediaDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  altText?: string;
}

@ApiTags('Media')
@Controller('media')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN' as any, 'SUPER_ADMIN' as any)
@ApiBearerAuth('access-token')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get()
  getMedia(
    @Query('page')   page?:   string,
    @Query('limit')  limit?:  string,
    @Query('search') search?: string,
    @Query('folder') folder?: string,
    @Query('format') format?: string,
  ) {
    return this.mediaService.getMedia({
      page:  page  ? Number(page)  : 1,
      limit: limit ? Number(limit) : 24,
      search,
      folder,
      format,
    });
  }

  @Get('folders')
  getFolders() {
    return this.mediaService.getFolders();
  }

  @Get('signed-url')
  getSignedUrl(@Query('folder') folder?: string) {
    return this.mediaService.getSignedUploadUrl(folder ?? 'misc');
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.mediaService.getMediaById(id);
  }

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file:   { type: 'string', format: 'binary' },
        folder: { type: 'string' },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits:  { fileSize: 10 * 1024 * 1024 },
    }),
  )
  async uploadOne(
    @UploadedFile() file: Express.Multer.File,
    @Query('folder') folder?: string,
    @CurrentUser('email') email?: string,
  ) {
    if (!file) throw new BadRequestException('No file provided');
    const media = await this.mediaService.uploadFile(
      file.buffer,
      file.originalname,
      file.mimetype,
      folder ?? 'misc',
      email,
    );
    return { success: true, data: media };
  }

  @Post('upload/bulk')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FilesInterceptor('files', 20, {
      storage: memoryStorage(),
      limits:  { fileSize: 10 * 1024 * 1024 },
    }),
  )
  async uploadBulk(
    @UploadedFiles() files: Express.Multer.File[],
    @Query('folder') folder?: string,
    @CurrentUser('email') email?: string,
  ) {
    if (!files?.length) throw new BadRequestException('No files provided');
    return this.mediaService.uploadFiles(
      files.map((f) => ({
        buffer:       f.buffer,
        originalName: f.originalname,
        mimetype:     f.mimetype,
      })),
      folder ?? 'misc',
      email,
    );
  }

  @Patch(':id')
  updateMedia(@Param('id') id: string, @Body() dto: UpdateMediaDto) {
    return this.mediaService.updateMedia(id, dto.altText ?? '');
  }

  @Delete(':id')
  deleteMedia(@Param('id') id: string) {
    return this.mediaService.deleteMedia(id);
  }

  @Post('bulk-delete')
  bulkDelete(@Body() body: { ids: string[] }) {
    return this.mediaService.bulkDelete(body.ids);
  }
}
