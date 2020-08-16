import {
  CallHandler, ExecutionContext,
  Injectable,
  NestInterceptor
} from '@nestjs/common';
import * as Sentry from '@sentry/minimal';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(
        tap(null, (exception) => {
          Sentry.captureException(exception);
        }),
      );
  }

}