import {
  IsNotEmpty,
  IsString,
  IsArray,
  IsIn,
  IsMongoId,
} from 'class-validator';

export class CreateJobDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  companyName: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  salaryRange: string;

  @IsIn(['Full-time', 'Part-time', 'Contract'])
  jobType: string;

  @IsString()
  @IsNotEmpty()
  experienceLevel: string;

  @IsArray()
  @IsString({ each: true })
  requiredSkills: string[];

  @IsIn(['Draft', 'Published', 'Archived'])
  status: string;

  // IMPORTANT: In a real app, this should come from the Auth Guard, but for now we require it in the DTO.
  @IsMongoId()
  @IsNotEmpty()
  employerId: string;
}
