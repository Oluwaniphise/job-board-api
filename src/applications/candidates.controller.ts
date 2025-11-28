import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import type { Request } from 'express';
import { put } from '@vercel/blob';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import type { JwtPayload } from '../strategy/jwt-strategy';
import { ApplicationsService } from './applications.service';
import { ApplyToJobDto } from './dto/apply-to-job.dto';
import { JobsService } from 'src/jobs/jobs.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('candidate')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('Candidate')
export class CandidatesController {
  constructor(
    private readonly applicationsService: ApplicationsService,
    private readonly jobsService: JobsService,
  ) {}

  @Get('jobs')
  listPublishedJobs() {
    return this.jobsService.findAll();
  }

  @Get('jobs/:id')
  viewJob(@Param('id') id: string) {
    return this.jobsService.findOneJob(id);
  }

  @Post('jobs/:jobId/applications')
  @UseInterceptors(FileInterceptor('resume'))
  async applyToJob(
    @Param('jobId') jobId: string,
    @Body() applyToJobDto: ApplyToJobDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    const user = req.user as JwtPayload;

    let resumeUrl = applyToJobDto.resumeUrl;

    if (file) {
      const putResult = await put(file.originalname, file.buffer, {
        access: 'public',
        contentType: file.mimetype,
      });
      resumeUrl = putResult.url;
    }

    return this.applicationsService.createApplication(
      { ...applyToJobDto, resumeUrl },
      jobId,
      user.sub,
    );
  }

  @Get('applications')
  myApplications(@Req() req: Request) {
    const user = req.user as JwtPayload;
    return this.applicationsService.findApplicationsByCandidate(user.sub);
  }

  @Get('jobs/:jobId/applications/me')
  myApplicationForJob(@Param('jobId') jobId: string, @Req() req: Request) {
    const user = req.user as JwtPayload;
    return this.applicationsService.findCandidateApplicationForJob(
      jobId,
      user.sub,
    );
  }
}
