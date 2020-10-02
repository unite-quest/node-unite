import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import CreateThemeDto from './dto/create-theme.dto';
import PhrasesInterface from './interfaces/phrases.interface';

@Injectable()
export class PhrasesService {
  constructor(
    @Inject('PHRASES_MODEL')
    private phrasesModel: Model<PhrasesInterface>,
  ) { }

  public createGroup(createThemeDto: CreateThemeDto): Promise<PhrasesInterface> {
    return this.phrasesModel.create(createThemeDto); //TODO error handling
  }

  public getGroup(title: string): Promise<PhrasesInterface> {
    return this.phrasesModel.findOne({ title }).exec();
  }
}
