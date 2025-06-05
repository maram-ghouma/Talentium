import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, NotFoundException, Put, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FreelancerProfileService } from './freelancer-profile.service';
import { CreateFreelancerProfileDto } from './dto/create-freelancer-profile.dto';
import { UpdateFreelancerProfileDto } from './dto/update-freelancer-profile.dto';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { User } from 'src/user/entities/user.entity';
import { UpdateClientProfileDto } from 'src/client-profile/dto/update-client-profile.dto';

@Controller('freelancer-profile')
export class FreelancerProfileController {
  constructor(private readonly freelancerProfileService: FreelancerProfileService) {}
  @UseGuards(AuthGuard('jwt'))
    @Get('me')
    async getMyProfile(@CurrentUser() user: any) {
      const profile = await this.freelancerProfileService.findByUserId(user.userId);
      const baseUrl = 'http://localhost:3000'; 
      if (!profile) {
                throw new NotFoundException('User not found');
      }
  profile.user.imageUrl = profile.user.imageUrl ? `${baseUrl}${profile.user.imageUrl}` : '';
  
      return profile;
    }
    @UseGuards(AuthGuard('jwt'))
    @Put('update')
    @UseInterceptors(FileInterceptor('imageUrl', {
    storage: diskStorage({
      destination: './uploads', 
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = file.originalname.split('.').pop();
        const filename = `${uniqueSuffix}.${ext}`;
        cb(null, filename);
      },
    }),
  }))
    async updateProfile(
      @CurrentUser() user: any,
      @UploadedFile() imageUrl: Express.Multer.File,
      @Body() updateProfileDto: UpdateFreelancerProfileDto,
    ) {
      const imagePath = imageUrl?.filename ? `/uploads/${imageUrl.filename}` : undefined;
      console.log(user.userId);
      return this.freelancerProfileService.updateFreelancerProfile(user.userId, {
        ...updateProfileDto,
        imageUrl: imagePath, 
      });
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('stats')
  async getStats(@CurrentUser() user: any) {
    return this.freelancerProfileService.getFreelancerStats(user.userId);
  }
}