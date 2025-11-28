import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { JobsService } from 'src/jobs/jobs.service';
import { ApplicationsService } from './applications.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import type { JwtPayload } from '../strategy/jwt-strategy';
import { CreateJobDto } from 'src/jobs/dto/create-job.dto';
import { UpdateJobDto } from 'src/jobs/dto/update-job.dto';

@Controller('employer')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('Employer')
export class EmployersController {
  constructor(
    private readonly jobsService: JobsService,
    private readonly applicationsService: ApplicationsService,
  ) {}

  @Get('jobs')
  findMyJobs(@Req() req: Request) {
    const user = req.user as JwtPayload;
    return this.jobsService.findJobsByEmployer(user.sub);
  }

  @Post('jobs')
  createJob(@Body() createJobDto: CreateJobDto, @Req() req: Request) {
    const user = req.user as JwtPayload;
    return this.jobsService.create(createJobDto, user.sub);
  }

  @Patch('jobs/:id')
  updateJob(
    @Param('id') id: string,
    @Body() updateJobDto: UpdateJobDto,
    @Req() req: Request,
  ) {
    const user = req.user as JwtPayload;
    return this.jobsService.updateJobForEmployer(id, user.sub, updateJobDto);
  }

  @Delete('jobs/:id')
  removeJob(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as JwtPayload;
    return this.jobsService.removeJobForEmployer(id, user.sub);
  }

  @Get('jobs/:jobId/applications')
  jobApplications(@Param('jobId') jobId: string, @Req() req: Request) {
    const user = req.user as JwtPayload;
    return this.applicationsService.findAllByJobApplicationsForEmployer(
      jobId,
      user.sub,
    );
  }
}
