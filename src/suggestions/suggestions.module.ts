import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';

import { SuggestionsController } from './suggestions.controller';
import { suggestionsProviders } from './suggestions.providers';
import { SuggestionsService } from './suggestions.service';


@Module({
  imports: [
    DatabaseModule,
  ],
  controllers: [
    SuggestionsController,
  ],
  providers: [
    SuggestionsService,
    ...suggestionsProviders,
  ],
})
export class SuggestionsModule { }