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
  Delete
} from '@nestjs/common';
import { MissionService } from './mission.service';
import { Request } from 'express';
import * as jsonwebtoken from 'jsonwebtoken';
import { CreateTaskDto } from './dto/create-task.dto';

@Controller('missions')
export class MissionController {
  constructor(private readonly missionService: MissionService) {}

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
    return this.missionService.findAll();
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

    return this.missionService.create(input);
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
