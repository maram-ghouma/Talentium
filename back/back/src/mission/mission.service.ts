import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mission } from 'src/mission/entities/mission.entity';
import { Task, TaskStatus } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class MissionService {
  constructor(
    @InjectRepository(Mission)
    private missionRepository: Repository<Mission>,
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  // Create a new mission
  async create(input: {
    title: string;
    description: string;
    status?: 'not_assigned' | 'in_progress' | 'completed';
    price: number;
    date: string;
    clientId?: number;
    requiredSkills: string[];
    deadline: Date;
    budget: string;
    clientName?: string;
    progress?: number;
    tasks?: { total: number; completed: number };
  }): Promise<Mission> {
    const mission = this.missionRepository.create({
      title: input.title,
      description: input.description,
      status: input.status || 'not_assigned',
      price: input.price,
      date: input.date,
      client: input.clientId ? { id: input.clientId } : undefined,
      requiredSkills: input.requiredSkills,
      deadline: input.deadline,
      budget: input.budget,
      clientName: input.clientName || 'john Client',
      progress: input.progress || 0,
      tasks: input.tasks || { total: 0, completed: 0 },
      createdAt: new Date(),
    });
    return this.missionRepository.save(mission);
  }

  // Find all missions
  async findAll(): Promise<Mission[]> {
    return this.missionRepository.find({
      relations: ['client', 'preselectedFreelancers', 'selectedFreelancer', 'tasklist'],
    });
  }

  // Find one mission by ID
  async findOne(id: number): Promise<Mission> {
    const mission = await this.missionRepository.findOne({
      where: { id },
      relations: ['client', 'preselectedFreelancers', 'selectedFreelancer', 'tasklist'],
    });
    if (!mission) {
      throw new NotFoundException(`Mission with ID ${id} not found`);
    }
    return mission;
  }

  // Update a mission
  async update(id: number, input: {
    title?: string;
    description?: string;
    status?: 'not_assigned' | 'in_progress' | 'completed';
    price?: number;
    date?: string;
    clientId?: number;
    requiredSkills?: string[];
    deadline?: Date;
    budget?: string;
    clientName?: string;
    progress?: number;
    tasks?: { total: number; completed: number };
    preselectedFreelancers?: any[];
    selectedFreelancer?: any;
  }): Promise<Mission> {
    const mission = await this.findOne(id);
    Object.assign(mission, {
      title: input.title || mission.title,
      description: input.description || mission.description,
      status: input.status || mission.status,
      price: input.price || mission.price,
      date: input.date || mission.date,
      client: input.clientId ? { id: input.clientId } : mission.client,
      requiredSkills: input.requiredSkills || mission.requiredSkills,
      deadline: input.deadline || mission.deadline,
      budget: input.budget || mission.budget,
      clientName: input.clientName || mission.clientName,
      progress: input.progress || mission.progress,
      tasks: input.tasks || mission.tasks,
      preselectedFreelancers: input.preselectedFreelancers || mission.preselectedFreelancers,
      selectedFreelancer: input.selectedFreelancer || mission.selectedFreelancer,
    });
    return this.missionRepository.save(mission);
  }

  // Remove a mission
  async remove(id: number): Promise<boolean> {
    const mission = await this.findOne(id);
    await this.missionRepository.remove(mission);
    return true;
  }

  // Get tasks for a mission (for Kanban board)
  async getMissionTasks(missionId: number, userId: number): Promise<Task[]> {
    const mission = await this.missionRepository.findOne({
      where: { id: missionId },
      relations: ['tasklist', 'client', 'selectedFreelancer'],  
    });
    if (!mission) {
      throw new NotFoundException(`Mission with ID ${missionId} not found`);
    }
    if (mission.client?.id !== userId && mission.selectedFreelancer?.id !== userId) {
      throw new ForbiddenException('Only the client or selected freelancer can access this mission');
    }
    console.log(`Fetching tasks for mission ID ${missionId} for user ID ${userId}`);
    return mission.tasklist || [];
  }

  // Update a task's status
  async updateTaskStatus(taskId: number, status: string, userId: number): Promise<Task> {
    const validStatuses = ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'];
    if (!validStatuses.includes(status)) {
      throw new NotFoundException(`Invalid status: ${status}. Must be NOT_STARTED, IN_PROGRESS, or COMPLETED`);
    }
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
      relations: ['mission', 'mission.client', 'mission.selectedFreelancer'],
    });
    if (!task) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }
    if (task.mission.client?.id !== userId && task.mission.selectedFreelancer?.id !== userId) {
      throw new ForbiddenException('Only the client or selected freelancer can update this task');
    }
    task.status = status as TaskStatus;
    return this.taskRepository.save(task);
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description, missionId } = createTaskDto;

    const mission = await this.missionRepository.findOne({
      where: { id: missionId },
    });

    if (!mission) {
      throw new NotFoundException('Mission not found');
    }

    const task = this.taskRepository.create({
      title,
      description,
      mission,
      status: TaskStatus.NOT_STARTED,
    });

    return this.taskRepository.save(task);
  }

  async deleteTask(taskId: string): Promise<void> {
    const result = await this.taskRepository.delete(taskId);

    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${taskId}" not found`);
    }
  }
}