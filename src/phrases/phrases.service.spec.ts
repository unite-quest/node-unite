import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import mockingoose from 'mockingoose';
import { Model, model } from 'mongoose';
import AuthUserModel from '../auth/auth-user.model';
import { RecordingModalTypes } from '../recording/dto/recording-modal-types';
import { UserRecordingService } from '../recording/__mocks__/user-recording.service';
import PhrasesInterface from './interfaces/phrases.interface';
import { PhrasesService } from './phrases.service';
import { PhrasesSchema } from './schemas/phrases.schema';


describe('PhrasesService', () => {
  let phrasesService: PhrasesService;
  let phrasesModel: Model<PhrasesInterface>;
  let mockUserRecordingService: any;
  const phrasesDb =
  {
    title: 'ciencia',
    cover: 'test.png',
    phrases: [{
      _id: 'id_0',
      text: 'phrase 1',
    }, {
      _id: 'id_1',
      text: 'phrase 2',
    }, {
      _id: 'id_2',
      text: 'phrase 3',
    }, {
      _id: 'id_3',
      text: 'phrase 4',
    }, {
      _id: 'id_4',
      text: 'phrase 5',
    }]
  };
  const user = new AuthUserModel({
    user_id: 'this dude',
    name: 'has name',
    email: 'also has email',
  });

  beforeEach(async () => {
    phrasesModel = model('Phrases', PhrasesSchema);
    PhrasesSchema.path('phrases', Object);
    mockUserRecordingService = new UserRecordingService();

    const moduleRef = await Test.createTestingModule({
      providers: [
        PhrasesService,
        {
          provide: UserRecordingService,
          useValue: mockUserRecordingService,
        },
        {
          provide: 'PHRASES_MODEL',
          useValue: phrasesModel,
        }],
    }).compile();

    phrasesService = moduleRef.get<PhrasesService>(PhrasesService);
  });

  describe('phrases service', () => {
    it('should resolve deps', () => {
      expect(phrasesService).not.toBeUndefined();
    });
  });

  describe('themes', () => {
    it('should get themes', async () => {
      mockingoose(phrasesModel).toReturn(phrasesDb, 'findOne');

      const theme = await phrasesService.getTheme('theme', user);

      expect(theme.cover).toBe('test.png');
      expect(theme.title).toBe('ciencia');
      expect(theme.total).toBe(5);
      expect(theme.stepsCap).toBe(1);
      expect(theme.modalEvents.length).toBe(2);
      expect(theme.modalEvents[0].eventIndex).toBe(1);
      expect(theme.modalEvents[0].score).toBe(100);
      expect(theme.modalEvents[0].type).toBe('FIRST_RECORDING');
      expect(theme.phrases.length).toBe(5);
      expect(theme.phrases[0].id).toBe('id_0');
      expect(theme.phrases[0].text).toBe('phrase 1');
      expect(theme.phrases[0].spoken).toBe(false);
      expect(theme.phrases[0].skipped).toBe(false);
    });

    it('should not get themes when finished is true', async () => {
      mockingoose(phrasesModel).toReturn(phrasesDb, 'findOne');
      mockUserRecordingService.filterRecordingTheme = jest.fn().mockReturnValue({
        finished: true,
      });

      expect.assertions(1);
      try {
        await await phrasesService.getTheme('theme', user);
      } catch (e) {
        expect(e).toStrictEqual(new BadRequestException('Already finished recording'));
      }
    });

    it('should fail to get themes when non existent', async () => {
      mockingoose(phrasesModel).toReturn(undefined, 'findOne');
      expect.assertions(1);
      try {
        await await phrasesService.getTheme('theme', user);
      } catch (e) {
        expect(e).toStrictEqual(new BadRequestException('Theme does not exist'));
      }
    });

    it('should return less modal events if user already scored', async () => {
      mockingoose(phrasesModel).toReturn(phrasesDb, 'findOne');
      mockUserRecordingService.getUser = jest.fn().mockReturnValue({
        user: {
          firebaseId: 'firebaseId',
        },
        themes: [],
        scoring: [{
          reason: RecordingModalTypes.FIRST_RECORDING,
        }],
      });

      const theme = await phrasesService.getTheme('theme', user);

      expect(theme.modalEvents.length).toBe(1);
    });
  });
});