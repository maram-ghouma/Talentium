import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { UserService } from './user/user.service';
import { seedAdmin } from './SeedAdmin';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS if needed (recommended for GraphQL)
  app.enableCors({
    origin: true,
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000, () => {
    console.log(`Server running on http://localhost:${process.env.PORT ?? 3000}/graphql`);
  });
}
bootstrap();