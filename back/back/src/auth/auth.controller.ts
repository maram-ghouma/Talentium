import { Controller, Post, Body, NotFoundException, UseGuards, Get, Patch, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from './decorators/current-user.decorator';
import { UserService } from 'src/user/user.service';
import { SwitchRoleDto } from 'src/user/dto/switch-role.sto';
import { User } from 'src/user/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService ,
    private readonly userService: UserService
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
  ): Promise<User> {
    return this.userService.switchUserRole(user.userId, switchDto);
  }

}
