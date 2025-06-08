import { Injectable,OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Badge, BadgeType } from './entities/badge.entity';

@Injectable()
export class BadgeService implements OnModuleInit {
  constructor(
    @InjectRepository(Badge)
    private badgeRepository: Repository<Badge>,
  ) {}

  async onModuleInit() {
    await this.createPredefinedBadges();
  }

  async createPredefinedBadges(): Promise<Badge[]> {
    const badges = [
      {
        type: BadgeType.BEGINNER,
        description: 'Awarded to new freelancers starting their journey',
      },
      {
        type: BadgeType.ADVANCED,
        description: 'Awarded to experienced freelancers with proven skills',
      },
      {
        type: BadgeType.CERTIFIED,
        description: 'Awarded to top-tier freelancers with exceptional performance',
      },
    ];

    const createdBadges: Badge[] = [];
    for (const badgeData of badges) {
      try {
        const badge = await this.badgeRepository
          .createQueryBuilder()
          .insert()
          .into(Badge)
          .values(badgeData)
          .orIgnore() 
          .execute();

        const savedBadge = await this.findByType(badgeData.type);
        createdBadges.push(savedBadge);
      } catch (error) {
        const existingBadge = await this.findByType(badgeData.type);
        if (existingBadge) {
          createdBadges.push(existingBadge);
        }
      }
    }

    console.log('Badges initialized successfully');
    return createdBadges;
  }


  async findAll(): Promise<Badge[]> {
    return this.badgeRepository.find({
      relations: ['users'],
    });
  }

  async findOne(id: number): Promise<Badge> {
    const badge = await this.badgeRepository.findOne({
      where: { id },
      relations: ['users'],
    });
    if (!badge) {
      throw new Error(`Badge with id ${id} not found`);
    }
    return badge;
  }

  async findByType(type: BadgeType): Promise<Badge> {
    const badge = await this.badgeRepository.findOne({
      where: { type },
      relations: ['users'],
    });
    if (!badge) {
      throw new Error(`Badge of type ${type} not found`);
    }
    return badge;
  }
  async assignBadgeToUser(userId: number, badgeType: BadgeType): Promise<Badge> {
    const badge = await this.findByType(badgeType);
    if (!badge) {
      throw new Error(`Badge of type ${badgeType} not found`);
    }

    await this.badgeRepository
      .createQueryBuilder()
      .relation(Badge, 'users')
      .of(badge.id)
      .add(userId);

    return badge;
  }

  async removeBadgeFromUser(userId: number, badgeType: BadgeType): Promise<void> {
    const badge = await this.findByType(badgeType);
    if (!badge) {
      throw new Error(`Badge of type ${badgeType} not found`);
    }

    await this.badgeRepository
      .createQueryBuilder()
      .relation(Badge, 'users')
      .of(badge.id)
      .remove(userId);
  }
}