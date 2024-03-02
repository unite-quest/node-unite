import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as Sentry from '@sentry/node';
import '@sentry/tracing';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './logging/logging.interceptor';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const requestContext = require('request-context');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  Sentry.init({
    dsn:
      'https://a26f1cc4e2475b04b7cc299ec8eec5ac@o433447.ingest.sentry.io/4506841887866880',
    integrations: [nodeProfilingIntegration()],
    // Performance Monitoring
    tracesSampleRate: 1.0, //  Capture 100% of the transactions
    // Set sampling rate for profiling - this is relative to tracesSampleRate
    profilesSampleRate: 1.0,
  });
  app.use(requestContext.middleware('request'));
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  await app.listen(process.env.PORT || 80);
}
bootstrap();
