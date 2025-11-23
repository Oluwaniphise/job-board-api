import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Job, JobDocument } from './entities/jobs.entity';

@Injectable()
export class JobsService {
  constructor(@InjectModel(Job.name) private jobModel: Model<JobDocument>) {}

  async create(createJobDto: CreateJobDto): Promise<Job> {
    const createdJob = new this.jobModel({
      ...createJobDto,
      employerId: new Types.ObjectId(createJobDto.employerId),
    });
    return await createdJob.save();
  }

  async findAll(): Promise<Job[]> {
    return this.jobModel.find().exec();
  }

  async findOneJob(id: string): Promise<Job> {
    const job = await this.jobModel.findById(id).exec();
    if (!job) {
      throw new NotFoundException(`Job with ID "${id}" not found.`);
    }
    return job;
  }

  async updateJob(id: string, updateJobDto: UpdateJobDto): Promise<Job> {
    const updatedJob = await this.jobModel
      .findByIdAndUpdate(id, updateJobDto, { new: true })
      .exec();
    if (!updatedJob) {
      throw new NotFoundException(`Job with ID "${id}" not found for update.`);
    }
    return updatedJob;
  }

  async removeJob(id: string): Promise<void> {
    const result = await this.jobModel
      .deleteOne({ _id: new Types.ObjectId(id) })
      .exec();

    if (result.deletedCount === 0) {
      throw new NotFoundException(
        `Job with ID "${id}" not found for deletion.`,
      );
    }
  }
}
