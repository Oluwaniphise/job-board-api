import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ApplicationStatus =
  | 'Pending'
  | 'Reviewing'
  | 'Interview'
  | 'Rejected'
  | 'Hired';

export type ApplicationDocument = HydratedDocument<Application>;

@Schema({
  timestamps: true,
  collection: 'applications',
})
export class Application {
  _id: Types.ObjectId;
  id?: string;

  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  candidateId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'Job' })
  jobId: Types.ObjectId;

  @Prop({
    required: true,
    enum: ['Pending', 'Reviewing', 'Interview', 'Rejected', 'Hired'],
    default: 'Pending',
  })
  status: ApplicationStatus;

  @Prop()
  coverLetterText?: string;

  @Prop()
  resumeUrl?: string;
}

export const ApplicationSchema = SchemaFactory.createForClass(Application);
