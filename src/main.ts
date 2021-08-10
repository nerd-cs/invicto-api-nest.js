import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const PORT = process.env.PORT || 3000;
  const HOST = process.env.SERVER_HOST || 'localhost';
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const corsConfig = {
    origin: (process.env.ORIGIN_REGEX || '').split(','),
    credentials: true,
  };

  app.enableCors(corsConfig);

  setupSessions(app);
  setupSwagger(app);
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(PORT, HOST);
  Logger.log(`Application started on: ${await app.getUrl()}`);
}

function setupSessions(app: NestExpressApplication) {
  const sessionConfig = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: Number(process.env.COOKIE_MAX_AGE),
      httpOnly: false,
    },
  };

  if (process.env.NODE_ENV === 'prod') {
    app.set('trust proxy', 1);
    sessionConfig.cookie['sameSite'] = 'none';
    sessionConfig.cookie['secure'] = true;
  }

  app.use(session(sessionConfig));
  app.use(passport.initialize());
  app.use(passport.session());
}

function setupSwagger(app: INestApplication) {
  const swaggerConf = new DocumentBuilder()
    .setTitle('Invicto API')
    .setDescription('REST API Documentation')
    .setVersion(process.env.API_VERSION)
    .addCookieAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConf);

  SwaggerModule.setup(process.env.SWAGGER_PATH, app, document);
}

bootstrap();
