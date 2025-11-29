// src/files/files.controller.ts

import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { put } from '@vercel/blob';

@Controller('files')
export class FilesController {
  private readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB limit

  @Post('upload-resume')
  // The string 'resume' must match the field name the frontend uses (e.g., formData.append('resume', file))
  @UseInterceptors(FileInterceptor('resume'))
  async uploadResume(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded.');
    }
    if (file.size > this.MAX_FILE_SIZE) {
      throw new BadRequestException('File size exceeds 5MB limit.');
    }

    // 1. Upload the file buffer to Vercel Blob
    const { url, pathname } = await put(file.originalname, file.buffer, {
      access: 'public', // Set access to public so it can be downloaded via URL
      contentType: file.mimetype,
      addRandomSuffix: true, // avoid collisions on repeated filenames
    });

    return {
      resumeUrl: url,
      pathname: pathname,
    };
  }
}
