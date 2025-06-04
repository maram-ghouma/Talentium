import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UserService } from './user/user.service';
import { seedAdmin } from './SeedAdmin';
import * as express from 'express';
import { join } from 'path';
import * as dotenv from 'dotenv'; // Add dotenv import

// Load .env file
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
    credentials: true,
  });
  console.log('Serving uploads from:', join(__dirname, '..', 'Uploads'));
  app.use('/uploads', express.static(join(process.cwd(), 'Uploads')));
  const userService = app.get(UserService);
  await seedAdmin(userService);



  await app.listen(process.env.PORT ?? 3000, () => {
    console.log(`Server running on http://localhost:${process.env.PORT ?? 3000}/graphql`);
  });
}
bootstrap();