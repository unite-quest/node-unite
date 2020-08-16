import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FirebaseService } from './firebase.service';
@Module({
  providers: [
    AuthService,
    FirebaseService,
  ],
  exports: [
    AuthService,
    FirebaseService,
  ]
})
export class AuthModule { }
