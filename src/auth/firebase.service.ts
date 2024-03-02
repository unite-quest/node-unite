import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { from, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class FirebaseService {
  constructor(private readonly _configService: ConfigService) {
    let firebaseConfig: string = this._configService.get(
      'FIREBASE_SERVICE_ACCOUNT',
    );
    firebaseConfig = Buffer.from(firebaseConfig, 'base64').toString('utf8');

    const serviceAccount = JSON.parse(this._escapeJsonString(firebaseConfig));
    serviceAccount['private_key'] = serviceAccount['private_key'].replace(
      /\\n/g,
      '\n',
    );

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }

  public validateToken(token: string): Observable<boolean> {
    if (!token) {
      return of(false);
    }

    token = token.replace('Bearer ', '');
    return from(admin.auth().verifyIdToken(token)).pipe(
      catchError(err => {
        return of(false);
      }),
      map(decodedToken => {
        return !!decodedToken;
      }),
    );
  }

  private _escapeJsonString(json: string): string {
    return json
      .replace(/\n/g, '\\\\n')
      .replace(/\r/g, '\\\\r')
      .replace(/\t/g, '\\\\t');
  }
}
