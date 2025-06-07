import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { User, UserRole } from '../user/entities/user.entity';
import { JwtAuthResponse } from './dto/jwt-auth-response.dto';
import { ClientProfileService } from 'src/client-profile/client-profile.service';
import { FreelancerProfileService } from 'src/freelancer-profile/freelancer-profile.service';
import { PaymentService } from 'src/payment/payment.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientProfile } from 'src/client-profile/entities/client-profile.entity';
import { FreelancerProfile } from 'src/freelancer-profile/entities/freelancer-profile.entity';
import { Mission } from 'src/mission/entities/mission.entity';
import { Review } from 'src/review/entities/review.entity';
import { Dispute, DisputeStatus } from 'src/dispute/entities/dispute.entity';
import { SwitchRoleDto } from 'src/user/dto/switch-role.sto';

@Injectable()
export class AuthService {
  constructor(
    private readonly paymentService:PaymentService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
     private readonly clientProfilesService: ClientProfileService,
    private readonly freelancerProfilesService: FreelancerProfileService,
     @InjectRepository(User)
    private readonly userRepo: Repository<User>,
      @InjectRepository(Dispute)
    private readonly disputeRepo: Repository<Dispute>,

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
    if (!user.isActive) {
  throw new UnauthorizedException('Account is suspended');
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
    /* const account = await this.paymentService.stripe.accounts.create({
  type: 'express',
  country: 'FR',
  email: registerDto.email,
  capabilities: {
    transfers: { requested: true },
  },
});
console.log('Stripe account created:', account.id);*/


await this.clientProfilesService.createProfileForUser(newUser, {
  phoneNumber: registerDto.phoneNumber,
  country: registerDto.country,
  stripeAccountId: 'acct_1RWz0BRBiMgVeRzi'//test account with stripe connect create account stripe and acrivate connect feature to test and get ur account key 
,
});

await this.freelancerProfilesService.createProfileForUser(newUser, {
  phoneNumber: registerDto.phoneNumber,
  country: registerDto.country,
  stripeAccountId: 'acct_1RWz0BRBiMgVeRzi', 
});

    const { password, ...result } = newUser;
    return result;
  }

 async suspendUserAndResolveDispute(userId: number, disputeId: number): Promise<{ message: string }> {
  const user = await this.userRepo.findOne({ where: { id: userId } });
  if (!user) throw new NotFoundException('User not found');

  const dispute = await this.disputeRepo.findOne({ where: { id: disputeId } });
  if (!dispute) throw new NotFoundException('Dispute not found');

  // Suspend user
  user.isActive = false;
  await this.userRepo.save(user);

  // Resolve dispute
  dispute.status = DisputeStatus.RESOLVED;  
  dispute.resolution = `User has been suspended due to violation of terms.`;
  await this.disputeRepo.save(dispute);

  return { message: 'User suspended and dispute resolved successfully' };
}

async switchUserRole(userId: number, switchDto: SwitchRoleDto): Promise<{ user: User; access_token: string }> {
    const user = await this.userRepo.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.currentRole === switchDto.newRole) {
      throw new BadRequestException(`User already has the role '${switchDto.newRole}'`);
    }

    user.currentRole = switchDto.newRole;
    const updatedUser = await this.userRepo.save(user);

    // 🔐 Create a new JWT with the updated role
    const payload = {
      sub: updatedUser.id,
      email: updatedUser.email,
      role: updatedUser.currentRole,
    };

    const token = this.jwtService.sign(payload);

    return {
      user: updatedUser,
      access_token: token,
    };
  }

  
}

