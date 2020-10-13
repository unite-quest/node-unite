import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FirebaseAuthGuard } from './firebase-auth.guard';
import { FirebaseService } from './firebase.service';
import { LooseFirebaseAuthGuard } from './loose-firebase-auth.guard';
@Module({
  providers: [
    AuthService,
    FirebaseService,
    FirebaseAuthGuard,
    LooseFirebaseAuthGuard,
  ],
  exports: [
    AuthService,
    FirebaseService,
    FirebaseAuthGuard,
    LooseFirebaseAuthGuard,
  ]
})
export class AuthModule { }
