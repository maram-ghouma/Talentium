import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, NotFoundException, BadRequestException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { User } from './entities/user.entity';
import { SwitchRoleDto } from './dto/switch-role.sto';
import { ClientProfileService } from 'src/client-profile/client-profile.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService,
    private readonly ClientService: ClientProfileService
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @Get('/badges/:id')
  findBadgesByUserId(@Param('id') id: number) {
    return this.userService.findBadgesByUserId(id);
  }

  

  
  

   
  
}
