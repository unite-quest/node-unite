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

  static decodeJwt(header: string): any {
    if (!header || header.indexOf('.') === -1) {
      return;
    }

    try {
      const [_, data, __] = header.split('.')
      return JSON.parse(Buffer.from(data, 'base64').toString('utf8'));
    } catch (err) {
      console.error(err);
      return;
    }
  }
}
