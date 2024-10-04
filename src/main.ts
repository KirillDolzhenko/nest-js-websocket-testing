import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import * as path from "path";
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix("api/firechat");
  
  const config = app.get(ConfigService);

  app.enableCors({
    credentials: true,
    origin: (origin, cb) => {
      console.log("Origin", origin);

      if (!origin || origin.startsWith(config.get("corsUrl"))) {
        console.log("Trueee")
        cb(null, true)
      }
    }
  });

  // app.use((req, res, next) => {
  //   console.log(req)
  //   // if (req.path.startsWith('/firechat')) {
      
  //   //   next(); // Если да, то пропускаем дальше
  //   // } else {
  //   //   res.status(403).send('Access denied'); 
  //   // }
  // });

  await app.listen(config.get("port") || 9000, config.get("ip"));

  console.log(await app.getUrl())
}

bootstrap();