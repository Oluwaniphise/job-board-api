import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type JobDocument = HydratedDocument<Job>;

@Schema({ timestamps: true, collection: 'jobs' })
export class Job {
  _id: Types.ObjectId;
  id?: string;

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

  @Prop({ required: true, enum: ['Mid-Level', 'Senior', 'Junior', 'Intern'] })
  experienceLevel: string; // e.g., "Mid-Level", "Senior"

  @Prop({ type: [String], default: [] }) // Stores an array of strings (Tags/Skills)
  requiredSkills: string[];

  @Prop({ default: 'Published', enum: ['Draft', 'Published', 'Archived'] })
  status: string;

  @Prop({
    type: Types.ObjectId,
    required: true,
    get: (value: Types.ObjectId) => value?.toString(),
  })
  employerId: Types.ObjectId | string;
}

export const JobSchema = SchemaFactory.createForClass(Job);

JobSchema.virtual('id').get(function (this: JobDocument) {
  return this._id?.toString();
});

const stripMongoFields = (_doc: unknown, ret: Record<string, any>) => {
  ret.id = ret._id?.toString();
  delete ret._id;
  delete ret.__v;
  return ret;
};

JobSchema.set('toJSON', {
  virtuals: true,
  getters: true,
  versionKey: false,
  transform: stripMongoFields,
});

JobSchema.set('toObject', {
  virtuals: true,
  getters: true,
  versionKey: false,
  transform: stripMongoFields,
});
