import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, NotFoundException, BadRequestException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

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

  @UseGuards(AuthGuard('jwt'))
    @Get('me')
    async getUser(@CurrentUser() user: any) {
console.log('user from @CurrentUser:', user);
console.log('user.userId:', user?.userId);

if (!user?.userId || isNaN(Number(user.userId))) {
  throw new BadRequestException('Invalid userId in JWT payload');
}
      const person = await this.userService.findById(user.userId);
      const baseUrl = 'http://localhost:4000'; 
      if (!person) {
        throw new NotFoundException('User not found');
      }
      person.imageUrl = person.imageUrl ? `${baseUrl}${person.imageUrl}` : '';

      return person;
    }

}
