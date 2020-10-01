import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import AuthUserModel from './auth-user.model';
import { AuthService } from './auth.service';
import { FirebaseService } from './firebase.service';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(
    private readonly _firebaseService: FirebaseService,
  ) { }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const header: string = request.header('Authorization');
    return this._firebaseService.validateToken(header).pipe(
      map((proceed) => {
        const decoded = AuthService.decodeJwt(header);
        AuthService.setLoggedUser(new AuthUserModel(decoded));
        return proceed;
      })
    );
  }
}