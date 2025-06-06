import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { UserRole } from '../user/entities/user.entity';
import { JwtAuthResponse } from './dto/jwt-auth-response.dto';
import { ClientProfileService } from 'src/client-profile/client-profile.service';
import { FreelancerProfileService } from 'src/freelancer-profile/freelancer-profile.service';
import { PaymentService } from 'src/payment/payment.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly paymentService:PaymentService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
     private readonly clientProfilesService: ClientProfileService,
    private readonly freelancerProfilesService: FreelancerProfileService,
  ) {}

  async validateUser(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.userService.findByEmail(email);

    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return null;

    const { password: _, ...result } = user;
    return result;
  }

  async login(loginDto: LoginDto): Promise<JwtAuthResponse> {
    const user = await this.validateUser(loginDto);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = {
      email: user.email,
      sub: user.id,
      role: user.currentRole,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '3d',
    });

    return {
      accessToken,
      refreshToken,
      user,
    };
  }

  async register(registerDto: CreateUserDto) {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    if (registerDto.email === adminEmail) {
      throw new BadRequestException('This email is reserved for admin.');
    }

    const userExists = await this.userService.findByEmail(registerDto.email);
    if (userExists) {
      throw new UnauthorizedException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const newUser = await this.userService.create({
      ...registerDto,
      password: hashedPassword,
      imageUrl: "/uploads/image.png"
    });
    const customer = await this.paymentService.stripe.customers.create({
  email: registerDto.email,
  name: registerDto.username,
});
    await this.clientProfilesService.createProfileForUser(newUser, {
  phoneNumber: registerDto.phoneNumber,
  country: registerDto.country,
  stripeAccountId: customer.id,
});

    await this.freelancerProfilesService.createProfileForUser(newUser, {
  phoneNumber: registerDto.phoneNumber,
  country: registerDto.country,
  stripeAccountId: customer.id,
});

    const { password, ...result } = newUser;
    return result;
  }
}
