import mockingoose from 'mockingoose';
import { model, Model } from 'mongoose';
import { BasicDataController } from './basic-data.controller';
import { BasicDataService } from './basic-data.service';
import { CreateBasicDataDto } from './dto/create-basic-data.dto';
import { BasicData } from './interfaces/basic-data.interface';
import { BasicDataSchema } from './schemas/basic-data.schema';

jest.mock('../auth/auth.service');

describe('BasicData Controller', () => {
  let controller: BasicDataController;
  let service: BasicDataService;
  let basicDataModel: Model<BasicData>;

  const _id = '507f191e810c19729de860eb';
  const data: CreateBasicDataDto = {
    firstName: 'AB',
    age: '26',
    sex: 'M',
    region: 'sul',
    dialect: 'paulistano',
  };

  beforeEach(() => {
    basicDataModel = model('BasicData', BasicDataSchema);
    mockingoose(basicDataModel).toReturn({ _id, ...data }, 'save');
    service = new BasicDataService(basicDataModel);
    controller = new BasicDataController(service);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a recording to database', async () => {
      const basicData = await controller.createBasicData(data);
      expect(basicData._id.toString()).toEqual(_id);
      expect(basicData.firstName).toEqual('AB');
      expect(basicData.age).toEqual('26');
      expect(basicData.sex).toEqual('M');
      expect(basicData.region).toEqual('sul');
      expect(basicData.dialect).toEqual('paulistano');
    });
  });
});
