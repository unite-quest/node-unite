import { ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FirebaseAuthGuard } from './firebase-auth.guard';

@Injectable()
export class LooseFirebaseAuthGuard extends FirebaseAuthGuard {
  canActivate(
    context: ExecutionContext,
  ): Observable<boolean> {
    return super.canActivate(context).pipe(
      map(() => true)
    );
  }
}