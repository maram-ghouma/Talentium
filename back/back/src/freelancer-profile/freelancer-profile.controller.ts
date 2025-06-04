import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FreelancerProfileService } from './freelancer-profile.service';
import { CreateFreelancerProfileDto } from './dto/create-freelancer-profile.dto';
import { UpdateFreelancerProfileDto } from './dto/update-freelancer-profile.dto';

@Controller('freelancer-profile')
export class FreelancerProfileController {
  constructor(private readonly freelancerProfileService: FreelancerProfileService) {}

}