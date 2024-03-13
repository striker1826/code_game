import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import * as passport from 'passport';
import { WsAdapter } from '@nestjs/platform-ws';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

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
    origin: true,
    credentials: true,
  });

  await app.listen(8000);
}
bootstrap();
