import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type JobDocument = HydratedDocument<Job>;

@Schema({ timestamps: true, collection: 'jobs' })
export class Job {
  _id: Types.ObjectId;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, trim: true })
  companyName: string;

  @Prop({ required: true, trim: true })
  location: string;

  @Prop({ required: true })
  description: string;

  @Prop()
  salaryRange: string;

  @Prop({ default: 'Full-time', enum: ['Full-time', 'Part-time', 'Contract'] })
  jobType: string;

  @Prop({ required: true, enum: ['Mid-Level', 'Senior', 'Junior'] })
  experienceLevel: string; // e.g., "Mid-Level", "Senior"

  @Prop({ type: [String], default: [] }) // Stores an array of strings (Tags/Skills)
  requiredSkills: string[];

  @Prop({ default: 'Published', enum: ['Draft', 'Published', 'Archived'] })
  status: string;

  @Prop({ type: Types.ObjectId, required: true })
  employerId: Types.ObjectId;
}

export const JobSchema = SchemaFactory.createForClass(Job);
