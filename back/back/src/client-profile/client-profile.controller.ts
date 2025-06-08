
import { Body, Controller, Get, NotFoundException, Param, Patch, Put, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ClientProfileService } from './client-profile.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { UpdateClientProfileDto } from './dto/update-client-profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { Express } from 'express';
import { ClientProfile } from './entities/client-profile.entity';
import { Roles } from 'src/auth/decorators/role.decorator';
import { RolesGuard } from 'src/auth/guards/RoleGuard';


@Controller('client-profile')
export class ClientProfileController {
  constructor(private readonly clientProfileService: ClientProfileService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async getMyProfile(@CurrentUser() user: any, @Query('id') id?: number) {
    console.log('User in the controller ', user);
    const userId = id ?? user.userId;
    const profile = await this.clientProfileService.findByUserId(userId);
    const baseUrl = 'http://localhost:3000'; 
    if (!profile) {
              throw new NotFoundException('User not found');
    }
profile.user.imageUrl = profile.user.imageUrl ? `${baseUrl}${profile.user.imageUrl}` : '';

    return profile;
  }
  
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('client')
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
  @UseGuards(AuthGuard('jwt'),RolesGuard)
  @Roles('client')
    @Get('Mystats')
  async getMyStats(@CurrentUser() user: any) {
    return this.clientProfileService.getClientStats(user.userId);
  }
   @UseGuards(AuthGuard('jwt'))
    @Get('stats')
  async getStats(@Query('id') id: number) {
    return this.clientProfileService.getClientStats(id);
  }

  @UseGuards(AuthGuard('jwt'),RolesGuard)
  @Roles('admin')
  @Get('AllClients')
  async getAllClients(): Promise<ClientProfile[]> {
    return this.clientProfileService.getAllClients();
  }

}
