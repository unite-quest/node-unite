import { Injectable } from '@nestjs/common';
import { AuthUserModel } from './auth-user.model';
import { RequestContextService } from './request-context.service';


@Injectable()
export class AuthService {
  private static _authUserKey = 'user';

  static setLoggedUser(user: AuthUserModel) {
    RequestContextService.set(AuthService._authUserKey, user);
  }

  static getLoggedUser(): AuthUserModel {
    return RequestContextService.get(AuthService._authUserKey);
  }
}
