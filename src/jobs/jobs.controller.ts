import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { Request } from 'express';
import type { JwtPayload } from '../strategy/jwt-strategy';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Employer')
  create(@Body() createJobDto: CreateJobDto, @Req() req: Request) {
    const user = req.user as JwtPayload;
    const employerId = user.sub;

    return this.jobsService.create(createJobDto, employerId);
  }

  @Get()
  findAll() {
    return this.jobsService.findAll();
  }

  @Get('employer')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Employer')
  findMyJobs(@Req() req: Request) {
    const user = req.user as JwtPayload;
    const employerId = user.sub;
    return this.jobsService.findJobsByEmployer(employerId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobsService.findOneJob(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Employer')
  update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto) {
    return this.jobsService.updateJob(id, updateJobDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Employer')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.jobsService.removeJob(id);
  }
}
