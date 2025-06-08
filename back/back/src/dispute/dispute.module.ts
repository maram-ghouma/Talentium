import { Module } from '@nestjs/common';
import { DisputeService } from './dispute.service';
import { DisputeController } from './dispute.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dispute } from './entities/dispute.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Dispute])],
  controllers: [DisputeController],
  providers: [DisputeService],
})
export class DisputeModule {}
