import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ApplicationsService } from './applications.service';
import { ApplicationsController } from './applications.controller';
import { Application, ApplicationSchema } from './entities/application.entity';
import { JobsModule } from '../jobs/jobs.module';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { EmployersController } from './employers.controller';
import { CandidatesController } from './candidates.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Application.name, schema: ApplicationSchema },
    ]),
    JobsModule,

    MulterModule.register({
      storage: memoryStorage(), // keep file in memory to stream to Vercel Blob
    }),
  ],
  controllers: [
    ApplicationsController,
    EmployersController,
    CandidatesController,
  ],
  providers: [ApplicationsService],
})
export class ApplicationsModule {}
