
import { Body, Controller, Get, NotFoundException, Patch, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ClientProfileService } from './client-profile.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { UpdateClientProfileDto } from './dto/update-client-profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { Express } from 'express';


@Controller('client-profile')
export class ClientProfileController {
  constructor(private readonly clientProfileService: ClientProfileService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async getMyProfile(@CurrentUser() user: any) {
    const profile = await this.clientProfileService.findByUserId(user.userId);
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
    @Body() updateProfileDto: UpdateClientProfileDto,
  ) {
    const imagePath = imageUrl?.filename ? `/uploads/${imageUrl.filename}` : undefined;
    console.log(user.userId);
    return this.clientProfileService.updateClientProfile(user.userId, {
      ...updateProfileDto,
      imageUrl: imagePath, 
    });
  }

}
