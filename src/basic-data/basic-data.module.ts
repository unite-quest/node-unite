import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { BasicDataController } from './basic-data.controller';
import { basicDataProviders } from './basic-data.providers';
import { BasicDataService } from './basic-data.service';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
  ],
  controllers: [
    BasicDataController,
  ],
  providers: [
    BasicDataService,
    ...basicDataProviders
  ]
})
export class BasicDataModule { }
