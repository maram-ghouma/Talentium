import { IsArray, IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateFreelancerProfileDto } from './create-freelancer-profile.dto';

export class UpdateFreelancerProfileDto {
     // User fields
      @IsOptional()
      @IsString()
      username?: string;
    
      
      @IsOptional()
      @IsEmail()
      email?: string;
    
      @IsOptional()
      @IsString()
      imageUrl?: string;
    
      @IsOptional()
      @IsString()
      bio?: string;
    
      @IsOptional()
      @IsNumber()
      hourlyRate?: number;

      @IsOptional()
      @IsArray()
      @IsString({ each: true })
      skills?: string[];

      @IsOptional()
      @IsString()
      country?: string;
    
      @IsOptional()
      @IsString()
      github?: string;
    
      @IsOptional()
      @IsString()
      phoneNumber?: string;
    
      @IsOptional()
      @IsString()
      linkedIn?: string;

      @IsOptional()
      @IsString() 
      stripeAccountId?: string;
}
