import { HttpModule, Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { scoringProviders } from './scoring.providers';
import { ScoringService } from './scoring.service';

@Module({
  imports: [
    DatabaseModule,
    HttpModule,
    AuthModule,
  ],
  controllers: [
  ],
  providers: [
    ScoringService,
    ...scoringProviders,
  ],
  exports: [
    ScoringService,
  ]
})
export class ScoringModule { }
