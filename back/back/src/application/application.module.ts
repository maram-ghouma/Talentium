import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { Application } from './entities/application.entity';
import { User } from 'src/user/entities/user.entity';
import { FreelancerProfile } from 'src/freelancer-profile/entities/freelancer-profile.entity';
import { ApplicationService } from './application.service';
import { ApplicationResolver } from './application.resolver';
import { FileController } from './file.controller';
import { UploadScalar } from './upload.scalar';
import { FreelancerProfileModule } from 'src/freelancer-profile/freelancer-profile.module';
import { Mission } from 'src/mission/entities/mission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Application,User,FreelancerProfile,Mission]),
    MulterModule.register({
      limits: {
        fileSize: 5 * 1024 * 1024, 
      },
      fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
          cb(null, true);
        } else {
          cb(new Error('Only PDF files are allowed'), false);
        }
      },
    }),
    FreelancerProfileModule
  ],
  providers: [ApplicationResolver, ApplicationService,UploadScalar],
  controllers: [FileController],
  exports: [ApplicationService],
})
export class ApplicationModule {}