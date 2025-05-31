import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UserService } from './user/user.service';
import { seedAdmin } from './SeedAdmin';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
    app.enableCors({
    origin: 'http://localhost:3000', 
    credentials: true,
  });
  
  const userService = app.get(UserService);
  await seedAdmin(userService);
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
