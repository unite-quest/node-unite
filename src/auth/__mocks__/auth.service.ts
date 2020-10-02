import { Injectable } from '@nestjs/common';
import AuthUserModel from '../auth-user.model';


@Injectable()
export class AuthService {
  static setLoggedUser(user: AuthUserModel) { }

  static getLoggedUser(): AuthUserModel {
    return new AuthUserModel({
      user_id: 'foobar',
      name: 'Dude',
      email: 'bledis@zedis.com',
    });
  }
}
