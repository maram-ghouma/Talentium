import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
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
    app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));
    app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));
  const userService = app.get(UserService);
  await seedAdmin(userService);


  await app.listen(process.env.PORT ?? 3000, () => {
    console.log(`Server running on http://localhost:${process.env.PORT ?? 3000}/graphql`);
  });
}
bootstrap();