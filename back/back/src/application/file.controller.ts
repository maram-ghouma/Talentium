import { 
  Controller, Get, Param, Res, NotFoundException, Post, UseInterceptors, UploadedFile, BadRequestException, 
  UseGuards
} from '@nestjs/common';
import { Response } from 'express';
import * as path from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApplicationService } from './application.service';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { FreelancerProfileService } from 'src/freelancer-profile/freelancer-profile.service';
import { FreelancerProfile } from 'src/freelancer-profile/entities/freelancer-profile.entity';
import { AuthGuard } from '@nestjs/passport';
  @UseGuards(AuthGuard('jwt'))
@Controller('files')
export class FileController {
  constructor(private readonly applicationService: ApplicationService,private readonly freelancerService: FreelancerProfileService) {}

  @Get('resume/:applicationId')
  async getResume(@Param('applicationId') applicationId: string, @Res() res: Response) {
    try {
      const { filepath, filename } = await this.applicationService.getResumeFile(applicationId);
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
      res.sendFile(path.resolve(filepath));
    } catch (error) {
      throw new NotFoundException('Resume file not found');
    }
  }

  @Post('upload/resume/:applicationId')
  @UseInterceptors(FileInterceptor('file'))

  async uploadResume(
    @UploadedFile() file: Express.Multer.File,
    @Param('applicationId') applicationId: string,
    @CurrentUser() user: User
  ) {
    console.log('user:', user);
    if (!file) {
      throw new BadRequestException('Resume file is required');
    }
    if (file.mimetype !== 'application/pdf') {
      throw new BadRequestException('Resume must be a PDF file');
    }

    const freelancer:FreelancerProfile = await this.freelancerService.findByUserId(user.id);

    const result = await this.applicationService.saveResumeFile(file,freelancer.id.toString(),applicationId );

    return {
      message: 'Resume uploaded successfully',
      freelancerId: freelancer.id,
      filename: file.originalname,
    };
  }
}
