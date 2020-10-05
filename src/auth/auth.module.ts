import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FirebaseAuthGuard } from './firebase-auth.guard';
import { FirebaseService } from './firebase.service';
@Module({
  providers: [
    AuthService,
    FirebaseService,
    FirebaseAuthGuard,
  ],
  exports: [
    AuthService,
    FirebaseService,
    FirebaseAuthGuard,
  ]
})
export class AuthModule { }
