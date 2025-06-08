import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  BadRequestException,
  NotFoundException,
  Patch,
  Delete,
  Query, UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { MissionService } from './mission.service';
import { User } from 'src/user/entities/user.entity';
import { Roles } from 'src/auth/decorators/role.decorator';
import { RolesGuard } from 'src/auth/guards/RoleGuard';
import { Request } from 'express';
import * as jsonwebtoken from 'jsonwebtoken';
import { CreateTaskDto } from './dto/create-task.dto';

@Controller('mission')
export class MissionController {
  constructor(private readonly missionService: MissionService) {}
  @UseGuards(AuthGuard('jwt'))
  @Get('my-client-missions')
  async getClientMissions(@CurrentUser() user: any, @Query('id') id?: number) {
    return this.missionService.getClientMissions(id ?? user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('my-freelancer-missions')
  async getFreelancerMissions(@CurrentUser() user: any, @Query('id') id?: number) {
    return this.missionService.getFreelancerMissions(id ??user.userId);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Get('admin-stats')
  async getAdminStats() {
    return this.missionService.getAdminStats();
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('freelancer')
  @Get('my-missions-with-reviews')
  async getMyMissionsAsFreelancer(@CurrentUser() user: any) {
    return this.missionService.getFreelancerMissionsWithReviews(user.userId);
  }

  private getUserIdFromRequest(req: Request): number {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new BadRequestException('Missing or invalid Authorization header');
    }

    const token = authHeader.split(' ')[1];
    let decoded: { sub?: number; userId?: number; email: string; role: string };

    try {
      decoded = jsonwebtoken.verify(token, 'temporary_secretkey') as typeof decoded;
    } catch (err) {
      throw new BadRequestException('Invalid token');
    }

    const userId = decoded.userId || decoded.sub;
    if (!userId) {
      throw new BadRequestException('User ID not found in token');
    }

    return userId;
  }

  @Get()
  async findAllMissions(@Req() req: Request) {
    this.getUserIdFromRequest(req); // just to enforce auth
    return this.missionService.findAllMaher();
  }

  @Get(':id')
  async findOneMission(@Param('id') id: string, @Req() req: Request) {
    this.getUserIdFromRequest(req); // enforce auth
    const mission = await this.missionService.findOne(Number(id));
    if (!mission) throw new NotFoundException(`Mission with ID ${id} not found`);
    return mission;
  }

  @Post()
  async createMission(@Body() body: any, @Req() req: Request) {
    const userId = this.getUserIdFromRequest(req);

    // Attach userId to clientId if you want missions to be linked to the current user
    const input = {
      ...body,
      clientId: userId,
    };

    return this.missionService.createMaher(input);
  }

  @Get('kanban/:id')
async getKanbanTasks(@Param('id') id: string, @Req() req: Request) {
  const userId = this.getUserIdFromRequest(req);
  const missionId = Number(id);
  return this.missionService.getMissionTasks(missionId, userId);
}


@Patch('task/:taskId')
async updateTaskStatus(
  @Param('taskId') taskId: string,
  @Body('status') status: string,
  @Req() req: Request
) {
  const userId = this.getUserIdFromRequest(req);
  return this.missionService.updateTaskStatus(Number(taskId), status, userId);
}

@Post('task')
  async createTask(@Body() createTaskDto: CreateTaskDto) {
    return this.missionService.createTask(createTaskDto);
  }

  @Delete('/task/delete/:id')
  async deleteTask(@Param('id') id: string): Promise<void> {
    return this.missionService.deleteTask(id);

  }
}
