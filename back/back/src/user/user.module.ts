import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientProfileService } from 'src/client-profile/client-profile.service';
import { ClientProfileModule } from 'src/client-profile/client-profile.module';

@Module({
    imports: [TypeOrmModule.forFeature([User]),ClientProfileModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, TypeOrmModule.forFeature([User])],
})
export class UserModule {}
