import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { AuthUserModel } from '../auth/auth-user.model';
import { CreateBasicDataDto } from './dto/create-basic-data.dto';
import { BasicData } from './interfaces/basic-data.interface';


@Injectable()
export class BasicDataService {
  constructor(
    @Inject('BASIC_DATA_MODEL')
    private basicDataModel: Model<BasicData>,
  ) { }

  create(data: CreateBasicDataDto, user: AuthUserModel) {
    return this.basicDataModel.create({ ...data, email: user.email });
  }

  async find(user: AuthUserModel) {
    return this.basicDataModel.findOne({ email: user.email });
  }
}
