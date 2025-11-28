import { IsNotEmpty, IsString, IsArray, IsIn } from 'class-validator';

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

  @IsIn(['Mid-Level', 'Senior', 'Junior', 'Intern'])
  experienceLevel: string;

  @IsArray()
  @IsString({ each: true })
  requiredSkills: string[];

  @IsIn(['Draft', 'Published', 'Archived'])
  status: string;
}
