import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import * as passport from 'passport';
import { winstonLogger } from './common/middleware/winstonLogger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const logger = winstonLogger;
  app.useLogger(logger);

  app.use(
    session({
      name: 'CODE_GAME_SESSION',
      secret: 'my-secret',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 6000,
      },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());
  // app.useWebSocketAdapter(new WsAdapter(app));
  app.enableCors({
    origin: [
      'https://algorithmcodegame.netlify.app',
      'http://localhost:3000',
      'http://battlecode.shop.s3-website.ap-northeast-2.amazonaws.com',
      'https://www.battlecode.shop',
    ],
    credentials: true,
  });

  await app.listen(8000);
}
bootstrap();
