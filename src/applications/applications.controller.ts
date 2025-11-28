import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { ApplyToJobDto } from './dto/apply-to-job.dto';
import { UpdateApplyToJobDto } from './dto/update-apply-to-job.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import type { Request } from 'express';
import type { JwtPayload } from '../strategy/jwt-strategy';


@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  // @Post()
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('Candidate')
  // create(@Body() applyToJobDto: ApplyToJobDto, @Req() req: Request) {
  //   const user = req.user as JwtPayload;
  //   const candidateId = user.sub;

  //   return this.applicationsService.createApplication(
  //     applyToJobDto,
  //     candidateId,
  //   );
  // }

  @Get('employer/job-applications/:jobId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Employer')
  findAllByJobApplicationsForEmployer(
    @Param('jobId') jobId: string,
    @Req() req: Request,
  ) {
    const user = req.user as JwtPayload;
    const employerId = user.sub;

    return this.applicationsService.findAllByJobApplicationsForEmployer(
      jobId,
      employerId,
    );
  }

  // @Get(':id')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('Candidate', 'Employer')
  // findOne(@Param('id') id: string) {
  //   return this.applicationsService.findOne(id);
  // }

  // @Patch(':id')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('Candidate')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateApplicationDto: UpdateApplicationDto,
  // ) {
  //   return this.applicationsService.update(+id, updateApplicationDto);
  // }

  // @Delete(':id')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('Candidate')
  // remove(@Param('id') id: string) {
  //   return this.applicationsService.remove(id);
  // }
}
