import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UserService } from './user/user.service';
import { seedAdmin } from './SeedAdmin';
import * as express from 'express';
import { join } from 'path';
import { seed } from './seed';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { ClientProfile } from './client-profile/entities/client-profile.entity';
import { FreelancerProfile } from './freelancer-profile/entities/freelancer-profile.entity';
import { Mission } from './mission/entities/mission.entity';
import { Application } from './application/entities/application.entity';
import { DatasetService } from './generate-dataset.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
    credentials: true,
  });
console.log('Serving uploads from:', join(__dirname, '..', 'uploads'));
app.use('/uploads', express.static(join(process.cwd(), 'uploads')));
/*
 await seed(
    app.get(getRepositoryToken(User)),
    app.get(getRepositoryToken(ClientProfile)),
    app.get(getRepositoryToken(FreelancerProfile)),
    app.get(getRepositoryToken(Mission)),
    app.get(getRepositoryToken(Application)),
  );

  await app.get(DatasetService).generateTrainingData(); 
  console.log('✅ Dataset generation complete.');*/
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));
  const userService = app.get(UserService);
  //await seedAdmin(userService);

  const port = process.env.PORT ?? 3000;
  await app.listen(port, () => {
    console.log(`🚀 REST & GraphQL server running at http://localhost:${port}`);
    console.log(`🔗 GraphQL Playground: http://localhost:${port}/graphql`);
  });
}
bootstrap();
