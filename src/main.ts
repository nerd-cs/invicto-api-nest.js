import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import { httpsRedirect } from './middleware/https-redirect.middleware';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import * as http from 'http';
import * as https from 'https';

const httpsOptions = {
  key: fs.readFileSync('./cert/server.key'),
  cert: fs.readFileSync('./cert/server.crt'),
};

async function bootstrap() {
  const PORT = process.env.PORT || 3000;
  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  const corsConfig = {
    origin: (process.env.ORIGIN_REGEX || '').split(','),
    credentials: true,
  };

  app.enableCors(corsConfig);
  app.use(httpsRedirect);

  setupSessions(app);
  setupSwagger(app);
  app.useGlobalPipes(new ValidationPipe());

  await app.init();

  http
    .createServer(server)
    .listen(PORT, () => Logger.log(`Application started on port ${PORT}`));
  https
    .createServer(httpsOptions, server)
    .listen(8443, () =>
      Logger.log('Application is listening for https on port 8443'),
    );
}

function setupSessions(app: INestApplication) {
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: Number(process.env.COOKIE_MAX_AGE),
        sameSite: 'none',
        httpOnly: false,
        secure: true,
      },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
}

function setupSwagger(app: INestApplication) {
  const swaggerConf = new DocumentBuilder()
    .setTitle('Invicto API')
    .setDescription('REST API Documentation')
    .setVersion(process.env.API_VERSION)
    .addCookieAuth('Cookie', { type: 'apiKey', in: 'header' })
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConf);

  SwaggerModule.setup(process.env.SWAGGER_PATH, app, document);
}

bootstrap();
