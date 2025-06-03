import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { UserService } from './user/user.service';
import { seedAdmin } from './SeedAdmin';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  const userService = app.get(UserService);
  await seedAdmin(userService);

  const port = process.env.PORT ?? 4000;
  await app.listen(port, () => {
    console.log(`🚀 REST & GraphQL server running at http://localhost:${port}`);
    console.log(`🔗 GraphQL Playground: http://localhost:${port}/graphql`);
  });
}
bootstrap();
