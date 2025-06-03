import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UserService } from './user/user.service';
import { seedAdmin } from './SeedAdmin';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS if needed (recommended for GraphQL)
  app.enableCors({
    origin: true,
    credentials: true,
  });
console.log('Serving uploads from:', join(__dirname, '..', 'uploads'));
app.use('/uploads', express.static(join(process.cwd(), 'uploads')));
  const userService = app.get(UserService);
  await seedAdmin(userService);


  await app.listen(process.env.PORT ?? 3000, () => {
    console.log(`Server running on http://localhost:${process.env.PORT ?? 3000}/graphql`);
  });
}
bootstrap();