// update-client-profile.dto.ts

import { IsOptional, IsString, IsEmail } from 'class-validator';

export class UpdateClientProfileDto {
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

  // Profile fields
  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  companyName?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  industry?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  linkedIn?: string;
}
