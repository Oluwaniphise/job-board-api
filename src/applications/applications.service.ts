import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ApplyToJobDto } from './dto/apply-to-job.dto';
import { UpdateApplyToJobDto } from './dto/update-apply-to-job.dto';
import {
  Application,
  ApplicationDocument,
} from './entities/application.entity';
import { JobsService } from '../jobs/jobs.service';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectModel(Application.name)
    private applicationModel: Model<ApplicationDocument>,
    private jobsService: JobsService,
  ) {}

  /**
   * Creates a new job application.
   * @param ApplyToJobDto The application details (jobId, coverLetterText, resumeUrl).
   * @param candidateId The verified ID of the Candidate from the JWT.
   * @returns The newly created application document.
   */
  async createApplication(
    applyToJobDto: ApplyToJobDto,
    jobId: string,
    candidateId: string,
  ): Promise<Application> {
    // 1. Check if the Job ID is valid and the job exists
    try {
      await this.jobsService.findOneJob(jobId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`Job with ID "${jobId}" not found.`);
      }
      throw error;
    }

    // 2. Prevent duplicate applications by the same candidate for the same job
    const existingApplication = await this.applicationModel
      .findOne({
        jobId: new Types.ObjectId(jobId),
        candidateId: new Types.ObjectId(candidateId),
      })
      .exec();

    if (existingApplication) {
      throw new ConflictException('You have already applied for this job.');
    }

    // 3. Create the new application document
    const createdApplication = new this.applicationModel({
      jobId: new Types.ObjectId(jobId),
      candidateId: new Types.ObjectId(candidateId),
      coverLetterText: applyToJobDto.coverLetterText,
      resumeUrl: applyToJobDto.resumeUrl,
      status: 'Pending',
    });

    return createdApplication.save();
  }

  /**
   * Retrieves all applications for a specific job, secured by Employer ownership.
   * This implements the core business logic of the ATS view.
   * @param jobId The ID of the job posting.
   * @param employerId The verified ID of the Employer from the JWT.
   * @returns Array of Application documents for the specified job.
   */
  async findAllByJobApplicationsForEmployer(
    jobId: string,
    employerId: string,
  ): Promise<Application[]> {
    const job = await this.jobsService.findOneJob(jobId);

    if (job.employerId.toString() !== employerId) {
      throw new UnauthorizedException(
        'Access denied. You do not own this job posting.',
      );
    }

    const applications = await this.applicationModel
      .find({
        jobId: new Types.ObjectId(jobId),
      })
      .populate('candidateId', 'firstName lastName email')
      .exec();

    return applications;
  }

  /**
   * Lists all applications submitted by a candidate.
   */
  async findApplicationsByCandidate(
    candidateId: string,
  ): Promise<Application[]> {
    return this.applicationModel
      .find({
        candidateId: new Types.ObjectId(candidateId),
      })
      .populate('jobId', 'title status employerId')
      .exec();
  }

  /**
   * Returns the candidate's application for a specific job (404 if none).
   */
  async findCandidateApplicationForJob(
    jobId: string,
    candidateId: string,
  ): Promise<Application> {
    const application = await this.applicationModel
      .findOne({
        jobId: new Types.ObjectId(jobId),
        candidateId: new Types.ObjectId(candidateId),
      })
      .populate('jobId', 'title status employerId')
      .exec();

    if (!application) {
      throw new NotFoundException('No application found for this job.');
    }

    return application;
  }
}
