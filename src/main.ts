import { NestFactory } from '@nestjs/core';
import * as Sentry from '@sentry/node';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './logging/logging.interceptor';
const requestContext = require('request-context'); // tslint:disable-line

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  Sentry.init({ dsn: 'https://ffd01336fa654be3922f48a1e3bacf1d@o433447.ingest.sentry.io/5392260' });
  app.use(requestContext.middleware('request'));
  app.useGlobalInterceptors(new LoggingInterceptor())
  app.enableCors();
  await app.listen(process.env.PORT || 80);
}
bootstrap();


