import { Controller, Post, Body, NotFoundException, UseGuards, Get, Patch, BadRequestException, Delete, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from './decorators/current-user.decorator';
import { UserService } from 'src/user/user.service';
import { Response } from 'express';
import { SwitchRoleDto } from 'src/user/dto/switch-role.sto';
import { User } from 'src/user/entities/user.entity';
import { ClientProfileService } from 'src/client-profile/client-profile.service';
import { Roles } from './decorators/role.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService ,
    private readonly userService: UserService,
    private readonly clientService: ClientProfileService
  ) {}

  @Post('register')
  register(@Body() registerDto:CreateUserDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

   @UseGuards(AuthGuard('jwt'))
    @Get('getUser')
    async getUser(@CurrentUser() user: any) {

      const person = await this.userService.findById(user.userId);
      const baseUrl = 'http://localhost:3000'; 
      if (!person) {
        throw new NotFoundException('User not found');
      }
      person.imageUrl = person.imageUrl ? `${baseUrl}${person.imageUrl}` : '';

      return person;
    }

    @UseGuards(AuthGuard('jwt'))
  @Patch('switch-role')
  async switchRole(
    @CurrentUser() user: any,
    @Body() switchDto: SwitchRoleDto,
  ) {
    return this.authService.switchUserRole(user.userId, switchDto);
  }
    @UseGuards(AuthGuard('jwt'))
    @Get('getClientName')
    async getClientName(@CurrentUser() user: any) {
      
      const clientProfile = await this.clientService.findByUserId(user.userId);
      return clientProfile ? clientProfile.companyName : 'Client not found';
    }
    
    @UseGuards(AuthGuard('jwt'))
    @Roles('admin')
@Patch('suspend')
async suspendUserAndResolveDispute(@Body() body: { userId: number, disputeId: number }) {
  return this.authService.suspendUserAndResolveDispute(body.userId, body.disputeId);
}

}
