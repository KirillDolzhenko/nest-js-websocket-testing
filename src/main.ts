import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  const config = app.get(ConfigService);
  app.enableCors({
    credentials: true,
    origin: 'http://localhost:5173'
  });

  await app.listen(config.get("port") || 9000);
}

bootstrap();
